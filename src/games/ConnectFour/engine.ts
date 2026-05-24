import type { CellData, Player } from './types';

export const COLUMNS = 7;
export const ROWS = 6;

export const createEmptyGrid = (): CellData[][] => {
  return Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(null));
};

// Returns the row index where the piece landed, or -1 if column is full
export const dropPiece = (grid: CellData[][], col: number, player: Player): number => {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === null) {
      grid[r][col] = player;
      return r;
    }
  }
  return -1;
};

export const checkWin = (grid: CellData[][], player: Player, lastAttempt: { r: number, c: number }): boolean => {
  const { r, c } = lastAttempt;
  let count = 0;

  // Horizontal
  count = 0;
  for (let i = 0; i < COLUMNS; i++) {
    if (grid[r][i] === player) count++;
    else count = 0;
    if (count >= 4) return true;
  }

  // Vertical
  count = 0;
  for (let i = 0; i < ROWS; i++) {
    if (grid[i][c] === player) count++;
    else count = 0;
    if (count >= 4) return true;
  }

  // Diagonal \ (Top-Left to Bottom-Right)
  count = 0;
  let startR = r; let startC = c;
  while (startR > 0 && startC > 0) { startR--; startC--; }
  while (startR < ROWS && startC < COLUMNS) {
    if (grid[startR][startC] === player) count++;
    else count = 0;
    if (count >= 4) return true;
    startR++; startC++;
  }

  // Diagonal / (Bottom-Left to Top-Right)
  count = 0;
  startR = r; startC = c;
  while (startR < ROWS - 1 && startC > 0) { startR++; startC--; }
  while (startR >= 0 && startC < COLUMNS) {
    if (grid[startR][startC] === player) count++;
    else count = 0;
    if (count >= 4) return true;
    startR--; startC++;
  }

  return false;
};

export const checkDraw = (grid: CellData[][]): boolean => {
  return grid[0].every(cell => cell !== null);
};
