import React, { useState, useCallback, useEffect } from 'react';
import type { Player, CellData } from './types';
import { createInitialGrid, getValidMoves, placePiece, countPieces, SIZE } from './engine';
import { RotateCcw, Undo2 } from 'lucide-react';

export default function Othello() {
  const [grid, setGrid] = useState<CellData[][]>(createInitialGrid());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('B');
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState<{grid: CellData[][], currentPlayer: Player, gameOver: boolean}[]>([]);
  
  const validMoves = getValidMoves(grid, currentPlayer);

  useEffect(() => {
    if (validMoves.length === 0 && !gameOver) {
      const nextPlayer = currentPlayer === 'B' ? 'W' : 'B';
      const nextValidMoves = getValidMoves(grid, nextPlayer);
      if (nextValidMoves.length === 0) {
        setGameOver(true);
      } else {
        // Automatically skip turn
        setCurrentPlayer(nextPlayer);
      }
    }
  }, [grid, currentPlayer, validMoves.length, gameOver]);

  const initGame = useCallback(() => {
    setGrid(createInitialGrid());
    setCurrentPlayer('B');
    setGameOver(false);
    setHistory([]);
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (gameOver) return;
    if (grid[r][c] !== null) return;
    
    const isValid = validMoves.some(m => m.r === r && m.c === c);
    if (!isValid) return;

    setHistory(prev => [...prev, { grid, currentPlayer, gameOver }]);

    const newGrid = placePiece(grid, r, c, currentPlayer);
    setGrid(newGrid);
    setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setGrid(lastState.grid);
    setCurrentPlayer(lastState.currentPlayer);
    setGameOver(lastState.gameOver);
    setHistory(prev => prev.slice(0, -1));
  };

  const { bCount, wCount } = countPieces(grid);
  
  const getWinner = () => {
    if (bCount > wCount) return 'Black';
    if (wCount > bCount) return 'White';
    return 'Tie';
  };

  const getPlayerColorClass = (player: Player | null) => {
    if (player === 'B') return 'bg-primary shadow-[0_0_15px_var(--color-primary)] opacity-90';
    if (player === 'W') return 'bg-secondary shadow-[0_0_15px_var(--color-secondary)] opacity-90';
    return '';
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center p-8 bg-bg-base font-mono min-h-screen">
      <div className="max-w-5xl w-full">

        <div className="flex items-end justify-between border-b-4 border-border pb-4 mb-8">
          <div>
            <h1 className="text-4xl text-text-main font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">Othello</h1>
            <p className="text-text-muted mt-2">Trap opponent's pieces to flip them into yours.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">

          <div className="bg-bg-surface border-4 border-border rounded-xl p-4 shadow-xl select-none">
            <div 
              className="grid bg-[#0a0a0a] border border-border/20 shadow-inner rounded overflow-hidden p-2 gap-1"
              style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
            >
              {grid.map((row, r) => row.map((cell, c) => {
                const isValid = validMoves.some(m => m.r === r && m.c === c);
                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center relative border border-border/10 rounded ${isValid && !gameOver ? 'cursor-pointer hover:bg-white/10' : ''} ${cell === null ? 'bg-bg-base/20' : 'bg-bg-base/40'}`}
                  >
                    {cell !== null && (
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-300 ${getPlayerColorClass(cell)}`} />
                    )}
                    {isValid && cell === null && !gameOver && (
                      <div className={`w-4 h-4 rounded-full opacity-30 ${getPlayerColorClass(currentPlayer)}`} />
                    )}
                  </div>
                );
              }))}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-64">
            
            <div className="bg-bg-surface border-4 border-border rounded-xl p-6 flex flex-col shadow-lg gap-4">
              <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase text-center mb-2">Scoreboard</h3>
              
              <div className="flex justify-between items-center bg-bg-base p-3 rounded border border-border/30 shadow-inner">
                 <div className="flex items-center gap-3">
                   <div className={`w-6 h-6 rounded-full ${getPlayerColorClass('B')}`} />
                   <span className="font-bold text-text-main">Black</span>
                 </div>
                 <span className="text-xl font-black text-primary">{bCount}</span>
              </div>

              <div className="flex justify-between items-center bg-bg-base p-3 rounded border border-border/30 shadow-inner">
                 <div className="flex items-center gap-3">
                   <div className={`w-6 h-6 rounded-full ${getPlayerColorClass('W')}`} />
                   <span className="font-bold text-text-main">White</span>
                 </div>
                 <span className="text-xl font-black text-secondary">{wCount}</span>
              </div>
            </div>

            <div className="bg-bg-surface border-4 border-border rounded-xl p-6 flex flex-col items-center shadow-lg">
              <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase mb-4">Current Turn</h3>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${getPlayerColorClass(currentPlayer)} ${gameOver ? 'hidden' : ''}`} />
                <span className={`font-bold text-lg ${gameOver ? 'text-text-muted' : 'text-text-main'}`}>
                  {gameOver ? 'None' : (currentPlayer === 'B' ? 'Black' : 'White')}
                </span>
              </div>
            </div>

            {gameOver && (
              <div className="bg-bg-surface border-4 border-primary rounded-xl p-6 flex flex-col items-center animate-pulse shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-2 text-primary">Game Over</h3>
                <p className="font-bold text-center text-text-main text-lg">
                  {getWinner() === 'Tie' ? 'It\'s a Tie!' : `${getWinner()} Wins!`}
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
