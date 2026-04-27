import React, { useState, useCallback } from 'react';
import type { Player, CellData } from './types';
import { createEmptyGrid, dropPiece, checkWin, checkDraw, COLUMNS, ROWS } from './engine';
import { RotateCcw, Undo2 } from 'lucide-react';

export default function ConnectFour() {
  const [grid, setGrid] = useState<CellData[][]>(createEmptyGrid());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [history, setHistory] = useState<{grid: CellData[][], currentPlayer: Player, winner: Player | 'draw' | null}[]>([]);

  const initGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setCurrentPlayer(1);
    setWinner(null);
    setHistory([]);
  }, []);

  const handleColumnClick = (col: number) => {
    if (winner !== null) return;

    const newGrid = grid.map(row => [...row]);
    const r = dropPiece(newGrid, col, currentPlayer);

    if (r !== -1) {
      setHistory(prev => [...prev, { grid, currentPlayer, winner }]);
      setGrid(newGrid);

      if (checkWin(newGrid, currentPlayer, { r, c: col })) {
        setWinner(currentPlayer);
      } else if (checkDraw(newGrid)) {
        setWinner('draw');
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setGrid(lastState.grid);
    setCurrentPlayer(lastState.currentPlayer);
    setWinner(lastState.winner);
    setHistory(prev => prev.slice(0, -1));
  };

  const getPlayerColorClass = (player: Player | null) => {
    if (player === 1) return 'bg-primary shadow-[0_0_15px_var(--color-primary)] opacity-90';
    if (player === 2) return 'bg-secondary shadow-[0_0_15px_var(--color-secondary)] opacity-90';
    return 'bg-bg-base/30';
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center p-8 bg-bg-base font-mono min-h-screen">
      <div className="max-w-5xl w-full">

        <div className="flex items-end justify-between border-b-4 border-border pb-4 mb-8">
          <div>
            <h1 className="text-4xl text-text-main font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Connect Four</h1>
            <p className="text-text-muted mt-2">Drop your pieces to connect four in a row.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">

          <div className="bg-bg-surface border-4 border-border rounded-xl p-4 shadow-xl select-none">
            <div className="flex justify-between bg-bg-base p-4 rounded-lg border border-border/20 shadow-inner">
              {Array.from({ length: COLUMNS }).map((_, c) => (
                <div 
                  key={c}
                  className="flex flex-col gap-2 cursor-pointer group"
                  onClick={() => handleColumnClick(c)}
                >
                  {/* Hover indicator slot */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                     <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${winner ? 'hidden' : getPlayerColorClass(currentPlayer)}`} />
                  </div>
                  
                  {Array.from({ length: ROWS }).map((_, r) => (
                    <div 
                      key={`${r}-${c}`} 
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-border flex items-center justify-center shadow-inner"
                    >
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-300 ${getPlayerColorClass(grid[r][c])}`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-64">
            <div className="bg-bg-surface border-4 border-border rounded-xl p-6 flex flex-col items-center shadow-lg">
              <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase mb-4">Turn</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full ${getPlayerColorClass(1)} transition-all ${currentPlayer === 1 ? 'scale-125' : 'opacity-30'}`} />
                <span className={`font-bold ${currentPlayer === 1 ? 'text-text-main' : 'text-text-muted'}`}>Player 1</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${getPlayerColorClass(2)} transition-all ${currentPlayer === 2 ? 'scale-125' : 'opacity-30'}`} />
                <span className={`font-bold ${currentPlayer === 2 ? 'text-text-main' : 'text-text-muted'}`}>Player 2</span>
              </div>
            </div>

            {winner && (
              <div className="bg-bg-surface border-4 border-primary rounded-xl p-6 flex flex-col items-center animate-pulse">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-2 text-primary">Game Over</h3>
                <p className="font-bold text-center text-text-main text-lg">
                  {winner === 'draw' ? 'It\'s a Draw!' : `Player ${winner} Wins!`}
                </p>
              </div>
            )}

            <div className="bg-bg-surface border-4 border-border rounded-xl p-4 flex flex-col gap-4">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className={`py-3 w-full rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors border border-border
                  ${history.length === 0 ? 'bg-bg-base/50 text-text-muted/50 cursor-not-allowed border-border/50' : 'bg-bg-base text-text-main hover:bg-text-muted/20'}`}
              >
                <Undo2 size={18} /> Undo
              </button>
              <button
                onClick={initGame}
                className="py-3 w-full bg-bg-base text-text-main hover:bg-text-muted/20 rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors border border-border"
              >
                <RotateCcw size={18} /> Restart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
