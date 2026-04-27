export type Direction = 'N' | 'E' | 'S' | 'W';

export type PipeShape = 
  | 'vertical' 
  | 'horizontal' 
  | 'corner-tr' 
  | 'corner-br' 
  | 'corner-bl' 
  | 'corner-tl' 
  | 'cross'
  | 'start'
  | 'empty';

export interface PipeData {
  shape: PipeShape;
  oozeProgress: number; // 0 to 100
  entryDir: Direction | null; // where did the ooze come from?
  crossProgress?: number; // 0 to 100 for the second pass
  crossEntryDir?: Direction | null; // second pass direction
}

export interface Coordinates {
  x: number;
  y: number;
}
