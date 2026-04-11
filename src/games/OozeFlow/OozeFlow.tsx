import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PipeData, PipeShape, Coordinates, Direction } from './types';
import { getRandomPipe, canConnect, getNextCell, getExitDirection, resetPipeBag } from './engine';
import Pipe from './Pipe';
import { FastForward, RotateCcw } from 'lucide-react';

const GridCell = React.memo(({ x, y, cell, onClick }: { x: number, y: number, cell: PipeData, onClick: (x: number, y: number) => void }) => {
  return (
    <div
      className="w-16 h-16 border border-border/20 cursor-pointer hover:bg-white/5 transition-colors relative"
      onClick={() => onClick(x, y)}
    >
      <Pipe data={cell} />
    </div>
  );
});

const GRID_W = 10;
const GRID_H = 8;
const INITIAL_DELAY_MS = 12000;

export default function OozeFlowGame() {
  const [grid, setGrid] = useState<PipeData[][]>([]);
  const [queue, setQueue] = useState<PipeShape[]>([]);
  const [currentOozePos, setCurrentOozePos] = useState<Coordinates>({ x: 2, y: 3 });
  const [oozeExitDir, setOozeExitDir] = useState<Direction>('E');
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'waiting' | 'flowing' | 'gameover'>('waiting');
  const [fastForward, setFastForward] = useState(false);
  const [waitTimer, setWaitTimer] = useState(INITIAL_DELAY_MS);

  const stateRef = useRef({ grid, queue, gameState });
  useEffect(() => {
    stateRef.current = { grid, queue, gameState };
  });

  const initGame = useCallback(() => {
    resetPipeBag();
    const initial: PipeData[][] = Array(GRID_H).fill(null).map(() =>
      Array(GRID_W).fill(null).map(() => ({ shape: 'empty', oozeProgress: 0, entryDir: null }))
    );
    initial[3][2] = { shape: 'start', oozeProgress: 100, entryDir: null };
    setGrid(initial);
    setQueue(Array.from({ length: 5 }, getRandomPipe));
    setCurrentOozePos({ x: 2, y: 3 });
    setOozeExitDir('E');
    setScore(0);
    setGameState('waiting');
    setFastForward(false);
    setWaitTimer(INITIAL_DELAY_MS);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = useCallback((x: number, y: number) => {
    const { grid: currentGrid, queue: currentQueue, gameState: currentGameState } = stateRef.current;
    
    if (currentGameState === 'gameover') return;

    const cell = currentGrid[y][x];
    if (cell.shape === 'start' || cell.oozeProgress > 0) return;

    const shapeToPlace = currentQueue[0];
    const newQueue = [...currentQueue.slice(1), getRandomPipe()];

    if (cell.shape !== 'empty') {
      setScore(s => s - 50);
    } else {
      setScore(s => s + 10);
    }

    const newGrid = [...currentGrid];
    newGrid[y] = [...newGrid[y]];
    newGrid[y][x] = { ...cell, shape: shapeToPlace };

    setGrid(newGrid);
    setQueue(newQueue);

    stateRef.current = {
      ...stateRef.current,
      grid: newGrid,
      queue: newQueue
    };
  }, []);

  useEffect(() => {
    if (gameState === 'gameover') return;

    const tickMs = fastForward ? 20 : 100;

    const tick = setInterval(() => {
      if (gameState === 'waiting') {
        setWaitTimer(t => {
          if (t <= 0 || fastForward) {
            setGameState('flowing');
            return 0;
          }
          return t - tickMs;
        });
        return;
      }

      setGrid(prevGrid => {
        const { x, y } = currentOozePos;
        const cell = prevGrid[y][x];

        // Start cell special behavior: we just immediately flow out
        if (cell.shape === 'start') {
          const nextCellCoords = getNextCell({ x, y }, 'E'); // fixed start exit
          if (nextCellCoords.x >= GRID_W || nextCellCoords.y >= GRID_H || nextCellCoords.x < 0 || nextCellCoords.y < 0) {
            setGameState('gameover');
            return prevGrid;
          }
          const nextCell = prevGrid[nextCellCoords.y][nextCellCoords.x];
          if (!canConnect('E', nextCell.shape)) {
            setGameState('gameover');
            return prevGrid;
          }

          setCurrentOozePos(nextCellCoords);
          const newGrid = [...prevGrid];
          newGrid[nextCellCoords.y] = [...newGrid[nextCellCoords.y]];
          // set the entry dir for the next cell
          // if we exited E, it entered from W.
          newGrid[nextCellCoords.y][nextCellCoords.x].entryDir = 'W';

          // Calculate next exit
          const nextExit = getExitDirection(nextCell.shape, 'W');
          if (nextExit) setOozeExitDir(nextExit);
          return newGrid;
        }

        if (cell.oozeProgress < 100) {
          const newGrid = [...prevGrid];
          newGrid[y] = [...newGrid[y]];

          // Normal speed: 4 progress per 100ms = 25 ticks = 2.5 seconds per tile
          // Fast Forward: 20 progress per 20ms = 5 ticks = 0.1 seconds per tile
          const increment = fastForward ? 20 : 4;

          newGrid[y][x] = { ...cell, oozeProgress: cell.oozeProgress + increment };
          if (newGrid[y][x].oozeProgress > 100) newGrid[y][x].oozeProgress = 100;
          return newGrid;
        }
        else {
          // Flow completed in current cell, look for next cell
          const nextCellCoords = getNextCell({ x, y }, oozeExitDir);

          if (nextCellCoords.x >= GRID_W || nextCellCoords.y >= GRID_H || nextCellCoords.x < 0 || nextCellCoords.y < 0) {
            setGameState('gameover');
            return prevGrid;
          }

          const nextCell = prevGrid[nextCellCoords.y][nextCellCoords.x];
          if (!canConnect(oozeExitDir, nextCell.shape) || nextCell.oozeProgress > 0) {
            // can't connect, or hitting a pipe already filled
            setGameState('gameover');
            return prevGrid;
          }

          // Move to next!
          setScore(s => s + 100);
          setCurrentOozePos(nextCellCoords);
          const newGrid = [...prevGrid];
          newGrid[nextCellCoords.y] = [...newGrid[nextCellCoords.y]];

          const entryDirs: Record<Direction, Direction> = { 'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E' };
          const newEntryDir = entryDirs[oozeExitDir];

          newGrid[nextCellCoords.y][nextCellCoords.x].entryDir = newEntryDir;
          const nextExit = getExitDirection(nextCell.shape, newEntryDir);
          if (nextExit) setOozeExitDir(nextExit);

          return newGrid;
        }
      });
    }, tickMs);

    return () => clearInterval(tick);
  }, [currentOozePos, oozeExitDir, gameState, fastForward]);

  return (
    <div className="w-full flex-grow flex flex-col items-center p-8 bg-bg-base font-mono min-h-screen">
      <div className="max-w-5xl w-full">

        {/* Header */}
        <div className="flex items-end justify-between border-b-4 border-border pb-4 mb-8">
          <div>
            <h1 className="text-4xl text-text-main font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Ooze Flow</h1>
            <p className="text-text-muted mt-2">Route the ooze to maximize points. Do not cross the streams.</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-text-main">{score.toString().padStart(5, '0')}</h2>
            <p className="text-sm font-bold text-accent tracking-widest uppercase">SCORE</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex gap-8">

          {/* Main Grid */}
          <div className="bg-bg-surface border-4 border-border rounded-xl p-4 shadow-xl">
            <div
              className="grid bg-[#0a0a0a]"
              style={{ gridTemplateColumns: `repeat(${GRID_W}, minmax(0, 1fr))`, width: 'fit-content' }}
            >
              {grid.map((row, y) => row.map((cell, x) => (
                <GridCell
                  key={`${y}-${x}`}
                  x={x}
                  y={y}
                  cell={cell}
                  onClick={handleCellClick}
                />
              )))}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-48">

            {/* Queue Viewer */}
            <div className="bg-bg-surface border-4 border-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase mb-4 text-center">Next Pipe</h3>
              <div className="flex flex-col items-center gap-2">
                {queue.map((qShape, i) => (
                  <div key={i} className={`w-16 h-16 bg-[#0a0a0a] rounded ${i === 0 ? 'border-2 border-primary shadow-[0_0_15px_rgba(170,59,255,0.4)] relative' : 'opacity-60 scale-75'}`}>
                    {i === 0 && <span className="absolute -left-2 top-0 h-full w-1 bg-primary rounded"></span>}
                    <Pipe data={{ shape: qShape, oozeProgress: 0, entryDir: null }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls & Engine Status */}
            <div className="bg-bg-surface border-4 border-border rounded-xl p-4 flex flex-col gap-4">
              {gameState === 'waiting' ? (
                <div className="text-center font-bold text-sm text-text-main py-2 bg-text-muted/20 rounded">
                  OOZE IN<br /><span className="text-xl text-primary mt-1 block">{(waitTimer / 1000).toFixed(1)}s</span>
                </div>
              ) : gameState === 'flowing' ? (
                <div className="text-center font-bold text-sm text-text-main py-2 bg-text-muted/20 rounded animate-pulse text-accent">
                  FLOWING
                </div>
              ) : (
                <div className="text-center font-bold text-sm text-text-main py-2 bg-red-500/20 text-red-500 rounded">
                  GAME OVER!
                </div>
              )}

              <button
                onClick={() => setFastForward(!fastForward)}
                disabled={gameState === 'gameover'}
                className={`py-3 w-full rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors
                  ${fastForward || gameState === 'gameover' ? 'bg-bg-base text-text-muted cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/80'}
                 `}
              >
                <FastForward size={18} /> Speed
              </button>

              <button
                onClick={initGame}
                className="py-3 w-full bg-bg-base text-text-main hover:bg-text-muted/20 rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors"
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
