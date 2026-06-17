import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FastForward, RotateCcw } from 'lucide-react';
import type { Ball, Wall, Rect, GameStatus, WallOrientation } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  WALL_THICKNESS,
  createInitialBalls,
  updatePhysics
} from './engine';

export default function JezzBallGame() {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameStatus>('waiting');
  const [balls, setBalls] = useState<Ball[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [areas, setAreas] = useState<Rect[]>([{ x: 0, y: 0, w: GAME_WIDTH, h: GAME_HEIGHT }]);
  const [areaFilledPct, setAreaFilledPct] = useState(0);
  const [orientation, setOrientation] = useState<WallOrientation>('horizontal');
  const [fastForward, setFastForward] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const nextWallId = useRef(0);

  const ballsRef = useRef<Ball[]>([]);
  const wallsRef = useRef<Wall[]>([]);
  const areasRef = useRef<Rect[]>([{ x: 0, y: 0, w: GAME_WIDTH, h: GAME_HEIGHT }]);

  const initGame = useCallback((newLevel = 1, resetLives = true) => {
    setLevel(newLevel);
    if (resetLives) {
      setLives(3);
      setScore(0);
    }
    const newBalls = createInitialBalls(newLevel);
    setBalls(newBalls);
    ballsRef.current = newBalls;
    setWalls([]);
    wallsRef.current = [];
    const initialAreas = [{ x: 0, y: 0, w: GAME_WIDTH, h: GAME_HEIGHT }];
    setAreas(initialAreas);
    areasRef.current = initialAreas;
    setAreaFilledPct(0);
    setGameState('waiting');
    nextWallId.current = 0;
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleBoardClick = (e: React.MouseEvent) => {
    if (gameState !== 'playing' && gameState !== 'waiting') return;
    if (gameState === 'waiting') setGameState('playing');

    if (walls.some(w => w.state === 'building')) return; // Already building

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newWall: Wall = {
      id: nextWallId.current++,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      orientation,
      state: 'building',
      progress: 0
    };
    setWalls(prev => {
      const next = [...prev, newWall];
      wallsRef.current = next;
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const loop = useCallback((time: number) => {
    if (gameState === 'playing') {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = (time - lastTimeRef.current) / 1000; // seconds
      const dt = fastForward ? deltaTime * 2 : deltaTime;

      const currentBalls = ballsRef.current;
      const currentWalls = wallsRef.current;
      const currentAreas = areasRef.current;
      
      const { nextBalls, nextWalls, nextAreas } = updatePhysics(
        currentBalls,
        currentWalls,
        currentAreas,
        dt,
        () => {
          setLives(l => {
            if (l <= 1) setGameState('game_over');
            return l > 1 ? l - 1 : 0;
          });
        },
        () => {
          setScore(s => s + 50);
        }
      );

      // Calculate true area filled percentage
      const totalArea = GAME_WIDTH * GAME_HEIGHT;
      const filledArea = nextAreas.filter(a => a.filled).reduce((sum, a) => sum + a.w * a.h, 0);
      const nextAreaPct = (filledArea / totalArea) * 100;
      setAreaFilledPct(nextAreaPct);
      if (nextAreaPct >= 75 && gameState === 'playing') {
        setGameState('level_complete');
      }

      ballsRef.current = nextBalls;
      wallsRef.current = nextWalls;
      areasRef.current = nextAreas;
      setBalls(nextBalls);
      setWalls(nextWalls);
      setAreas(nextAreas);
    }

    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(loop);
  }, [gameState, areas, fastForward]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  return (
    <div className="w-full flex-grow flex flex-col items-center p-8 bg-bg-base font-mono min-h-screen">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-end justify-between border-b-4 border-border pb-4 mb-8">
          <div>
            <h1 className="text-4xl text-text-main font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">JezzBall</h1>
            <p className="text-text-muted mt-2">Isolate the bouncing atoms. Right-click to toggle wall direction.</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-text-main">{score.toString().padStart(5, '0')}</h2>
            <p className="text-sm font-bold text-accent tracking-widest uppercase">SCORE</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex gap-8">
          {/* Main Board */}
          <div className="bg-bg-surface border-4 border-border rounded-xl p-4 shadow-xl select-none">
            <div
              ref={containerRef}
              onClick={handleBoardClick}
              onContextMenu={handleContextMenu}
              className="bg-[#0a0a0a] relative overflow-hidden cursor-crosshair"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {balls.map(b => (
                <div
                  key={b.id}
                  className="absolute bg-primary rounded-full shadow-[0_0_10px_rgba(170,59,255,0.8)]"
                  style={{
                    left: b.x - b.radius,
                    top: b.y - b.radius,
                    width: b.radius * 2,
                    height: b.radius * 2,
                  }}
                />
              ))}

              <div className="absolute inset-0 opacity-80 pointer-events-none">
                {/* Render filled areas */}
                {areas.filter(a => a.filled).map((a, i) => (
                  <div
                    key={`area-${i}`}
                    className="absolute bg-secondary"
                    style={{ left: a.x, top: a.y, width: a.w, height: a.h }}
                  />
                ))}

                {walls.map(w => {
                  let wx, wy, ww, wh;
                  if (w.state === 'building') {
                    if (w.orientation === 'horizontal') {
                      wx = w.startX - w.progress;
                      wy = w.startY - WALL_THICKNESS / 2;
                      ww = w.progress * 2;
                      wh = WALL_THICKNESS;
                    } else {
                      wx = w.startX - WALL_THICKNESS / 2;
                      wy = w.startY - w.progress;
                      ww = WALL_THICKNESS;
                      wh = w.progress * 2;
                    }
                  } else {
                    if (w.orientation === 'horizontal') {
                      wx = Math.min(w.startX, w.endX) - WALL_THICKNESS / 2;
                      wy = w.startY - WALL_THICKNESS / 2;
                      ww = Math.abs(w.endX - w.startX) + WALL_THICKNESS;
                      wh = WALL_THICKNESS;
                    } else {
                      wx = w.startX - WALL_THICKNESS / 2;
                      wy = Math.min(w.startY, w.endY) - WALL_THICKNESS / 2;
                      ww = WALL_THICKNESS;
                      wh = Math.abs(w.endY - w.startY) + WALL_THICKNESS;
                    }
                  }

                  return (
                    <div
                      key={w.id}
                      className={`absolute bg-secondary ${w.state === 'building' ? 'shadow-[0_0_8px_rgba(59,255,204,0.5)] z-10' : ''}`}
                      style={{ left: wx, top: wy, width: ww, height: wh }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-6 w-48">
            {/* Stats */}
            <div className="bg-bg-surface border-4 border-border rounded-xl p-4 flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Level</h3>
                <div className="text-2xl font-bold text-text-main">{level}</div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Lives</h3>
                <div className="text-2xl font-bold text-red-500">{Array(lives).fill('♥').join(' ')}</div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Orientation</h3>
                <div className="text-lg font-bold text-secondary uppercase">{orientation}</div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Area Filled</h3>
                <div className="text-lg font-bold text-text-main">{areaFilledPct.toFixed(0)}% / 75%</div>
                <div className="w-full bg-[#0a0a0a] h-2 mt-1 rounded overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, areaFilledPct)}%` }} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-bg-surface border-4 border-border rounded-xl p-4 flex flex-col gap-4">
              {gameState === 'waiting' ? (
                <button
                  onClick={() => setGameState('playing')}
                  className="py-3 w-full bg-primary text-white hover:bg-primary/80 rounded font-bold uppercase tracking-wider transition-colors"
                >
                  Start Level
                </button>
              ) : gameState === 'level_complete' ? (
                <button
                  onClick={() => initGame(level + 1, false)}
                  className="py-3 w-full bg-secondary text-bg-surface hover:bg-secondary/80 rounded font-bold uppercase tracking-wider transition-colors animate-pulse"
                >
                  Next Level
                </button>
              ) : gameState === 'game_over' ? (
                <div className="text-center font-bold text-sm text-text-main py-2 bg-red-500/20 text-red-500 rounded">
                  GAME OVER!
                </div>
              ) : (
                <div className="text-center font-bold text-sm text-text-main py-2 bg-text-muted/20 rounded animate-pulse text-accent">
                  PLAYING
                </div>
              )}

              <button
                onClick={() => setFastForward(!fastForward)}
                className={`py-3 w-full rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors
                  ${fastForward ? 'bg-bg-base text-text-muted' : 'bg-primary text-white hover:bg-primary/80'}
                 `}
              >
                <FastForward size={18} /> Speed
              </button>

              <button
                onClick={() => initGame(1, true)}
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
