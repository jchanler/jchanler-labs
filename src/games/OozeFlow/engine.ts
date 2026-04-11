import type { Direction, PipeShape, Coordinates } from './types';

export const getOppositeDirection = (dir: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E'
  };
  return opposites[dir];
};

export const getPipeConnections = (shape: PipeShape): Direction[] => {
  switch (shape) {
    case 'vertical': return ['N', 'S'];
    case 'horizontal': return ['E', 'W'];
    case 'corner-tr': return ['N', 'E'];
    case 'corner-br': return ['S', 'E'];
    case 'corner-bl': return ['S', 'W'];
    case 'corner-tl': return ['N', 'W'];
    case 'cross': return ['N', 'S', 'E', 'W'];
    case 'start': return ['N', 'S', 'E', 'W']; 
    default: return [];
  }
};

let pipeBag: PipeShape[] = [];
let lastGiven: PipeShape | null = null;
let repeatCount = 0;

export const resetPipeBag = () => {
  pipeBag = [];
  lastGiven = null;
  repeatCount = 0;
};

export const getRandomPipe = (): PipeShape => {
  if (pipeBag.length === 0) {
    const shapes: PipeShape[] = ['vertical', 'horizontal', 'corner-tr', 'corner-br', 'corner-bl', 'corner-tl', 'cross'];
    const extraPool: PipeShape[] = ['vertical', 'horizontal', 'corner-tr', 'corner-br', 'corner-bl', 'corner-tl'];
    
    const extra: PipeShape[] = [];
    while (extra.length < 3) {
      extra.push(extraPool[Math.floor(Math.random() * extraPool.length)]);
    }

    pipeBag = [...shapes, ...extra];
    
    for (let i = pipeBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pipeBag[i], pipeBag[j]] = [pipeBag[j], pipeBag[i]];
    }
  }

  let next = pipeBag[pipeBag.length - 1];
  if (next === lastGiven) {
    if (repeatCount >= 2) {
      const otherIndex = pipeBag.findIndex(p => p !== lastGiven);
      if (otherIndex !== -1) {
        const temp = pipeBag[pipeBag.length - 1];
        pipeBag[pipeBag.length - 1] = pipeBag[otherIndex];
        pipeBag[otherIndex] = temp;
        next = pipeBag[pipeBag.length - 1];
      }
    }
    repeatCount++;
  } else {
    repeatCount = 1;
  }

  lastGiven = next;
  return pipeBag.pop()!;
};

export const getNextCell = (currentPos: Coordinates, exitDir: Direction): Coordinates => {
  const {x, y} = currentPos;
  switch (exitDir) {
    case 'N': return {x, y: y - 1};
    case 'S': return {x, y: y + 1};
    case 'E': return {x: x + 1, y};
    case 'W': return {x: x - 1, y};
  }
};

export const canConnect = (fromEntityExitDir: Direction, targetPipe: PipeShape): boolean => {
  if (targetPipe === 'empty' || targetPipe === 'start') return false;
  const targetNeedsEntryFrom = getOppositeDirection(fromEntityExitDir);
  return getPipeConnections(targetPipe).includes(targetNeedsEntryFrom);
};

export const getExitDirection = (shape: PipeShape, entryDirection: Direction): Direction | null => {
  if (shape === 'cross') {
    return getOppositeDirection(entryDirection); // flow straight through cross
  }
  const conns = getPipeConnections(shape);
  const exit = conns.find(dir => dir !== entryDirection);
  return exit || null;
};
