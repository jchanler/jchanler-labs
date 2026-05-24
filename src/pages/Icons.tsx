import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ambientBg from '../assets/backgrounds/ambient.jpg';

function isDefaultTheme(): boolean {
  const root = document.documentElement;
  return !root.classList.contains('theme-neon') && !root.classList.contains('theme-vintage');
}

const SIZE_KEY = 'icons-page-size';
const BORDER_KEY = 'icons-page-border';
const GAP = 12;
const MIN_SIZE = 16;
const MAX_SIZE = 256;
const DEFAULT_SIZE = 128;
const MIN_BORDER = 0;
const MAX_BORDER = 8;
const DEFAULT_BORDER = 2;
const MAX_COLUMNS = 20;

const iconModules = import.meta.glob('../assets/icons/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const icons = Object.entries(iconModules)
  .map(([path, url]) => ({
    name: path.split('/').pop() ?? path,
    url,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

function readStoredInt(key: string, fallback: number, min: number, max: number): number {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function Icons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [defaultTheme, setDefaultTheme] = useState(isDefaultTheme);
  const [size, setSize] = useState(() => readStoredInt(SIZE_KEY, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE));
  const [border, setBorder] = useState(() =>
    readStoredInt(BORDER_KEY, DEFAULT_BORDER, MIN_BORDER, MAX_BORDER),
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setDefaultTheme(isDefaultTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setDefaultTheme(isDefaultTheme());
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const columnCount = useMemo(() => {
    if (containerWidth <= 0) return 1;
    return Math.min(
      MAX_COLUMNS,
      Math.max(1, Math.floor((containerWidth + GAP) / (size + GAP))),
    );
  }, [containerWidth, size]);

  const rows = useMemo(() => chunk(icons, columnCount), [columnCount]);

  const updateSize = useCallback((value: number) => {
    setSize(value);
    localStorage.setItem(SIZE_KEY, String(value));
  }, []);

  const updateBorder = useCallback((value: number) => {
    setBorder(value);
    localStorage.setItem(BORDER_KEY, String(value));
  }, []);

  return (
    <div
      className={`w-full min-h-full flex flex-col p-8 text-text-main ${defaultTheme ? '' : 'bg-bg-base'}`}
      style={
        defaultTheme
          ? {
              backgroundImage: `url(${ambientBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      <div className="w-full mb-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
        <label className="flex flex-col gap-2 flex-1 max-w-md">
          <span className="text-sm font-medium text-text-muted">
            Size: <span className="text-text-main font-mono">{size}px</span>
          </span>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={size}
            onChange={(e) => updateSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
        <label className="flex flex-col gap-2 flex-1 max-w-md">
          <span className="text-sm font-medium text-text-muted">
            Border: <span className="text-text-main font-mono">{border}px</span>
          </span>
          <input
            type="range"
            min={MIN_BORDER}
            max={MAX_BORDER}
            value={border}
            onChange={(e) => updateBorder(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
      </div>

      <div ref={containerRef} className="w-full flex flex-col" style={{ gap: GAP }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap"
            style={{
              gap: GAP,
              paddingLeft: rowIndex % 2 === 1 ? (size + GAP) / 2 : 0,
            }}
          >
            {row.map((icon) => (
              <div
                key={icon.name}
                className="rounded-full overflow-hidden border-border shrink-0 transition-colors"
                style={{
                  width: size,
                  height: size,
                  borderWidth: border,
                  borderStyle: 'solid',
                }}
              >
                <img
                  src={icon.url}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
