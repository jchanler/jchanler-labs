export interface Coordinates {
  x: number;
  y: number;
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export type WallOrientation = 'horizontal' | 'vertical';

export interface Wall {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  orientation: WallOrientation;
  state: 'building' | 'built';
  progress: number; // 0 to 1
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  filled?: boolean;
}

export interface LevelData {
  level: number;
  lives: number;
  areaFilled: number;
  targetArea: number;
}

export type GameStatus = 'waiting' | 'playing' | 'level_complete' | 'game_over';
