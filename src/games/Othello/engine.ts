import type { CellData, Player } from './types';

export const SIZE = 8;

export const createInitialGrid = (): CellData[][] => {
  const grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
  grid[3][3] = 'W';
  grid[3][4] = 'B';
  grid[4][3] = 'B';
  grid[4][4] = 'W';
  return grid;
};

const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const getValidMoves = (grid: CellData[][], player: Player): { r: number, c: number }[] => {
  const validMoves: { r: number, c: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== null) continue;
      
      let isValidMove = false;
      for (const [dr, dc] of DIRS) {
        if (canFlip(grid, r, c, dr, dc, player)) {
          isValidMove = true;
          break;
        }
      }
      if (isValidMove) validMoves.push({ r, c });
    }
  }
  return validMoves;
};

const canFlip = (grid: CellData[][], r: number, c: number, dr: number, dc: number, player: Player): boolean => {
  let nr = r + dr;
  let nc = c + dc;
  let hasOpponent = false;
  
  const opponent = player === 'B' ? 'W' : 'B';

  while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
    if (grid[nr][nc] === opponent) {
      hasOpponent = true;
    } else if (grid[nr][nc] === player) {
      return hasOpponent;
    } else {
      return false; // Empty space
    }
    nr += dr;
    nc += dc;
  }
  return false;
};

export const placePiece = (grid: CellData[][], r: number, c: number, player: Player): CellData[][] => {
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = player;
  
  for (const [dr, dc] of DIRS) {
    if (canFlip(newGrid, r, c, dr, dc, player)) {
      let nr = r + dr;
      let nc = c + dc;
      while (newGrid[nr][nc] !== player) {
        newGrid[nr][nc] = player;
        nr += dr;
        nc += dc;
      }
    }
  }
  return newGrid;
};

export const countPieces = (grid: CellData[][]): { bCount: number, wCount: number } => {
  let bCount = 0;
  let wCount = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 'B') bCount++;
      else if (grid[r][c] === 'W') wCount++;
    }
  }
  return { bCount, wCount };
};
