import React from 'react';
import type { PipeData } from './types';

interface PipeProps {
  data: PipeData;
}

export default React.memo(function Pipe({ data }: PipeProps) {
  const { shape, oozeProgress, entryDir } = data;

  const baseColor = 'stroke-border';
  const oozeColor = 'stroke-accent';
  
  // A helper to draw the pipe paths. Grid cells are 100x100 relative viewBox.
  const getPath = () => {
    switch (shape) {
      case 'vertical': return 'M 50 0 L 50 100';
      case 'horizontal': return 'M 0 50 L 100 50';
      case 'corner-tr': return 'M 50 0 L 50 50 L 100 50'; // N to E
      case 'corner-br': return 'M 100 50 L 50 50 L 50 100'; // E to S
      case 'corner-bl': return 'M 0 50 L 50 50 L 50 100'; // W to S
      case 'corner-tl': return 'M 50 0 L 50 50 L 0 50'; // N to W
      case 'cross': return 'M 50 0 L 50 100 M 0 50 L 100 50';
      default: return '';
    }
  };

  const getOozePath = () => {
    if (shape === 'cross') {
      if (entryDir === 'N' || entryDir === 'S') return 'M 50 0 L 50 100';
      return 'M 0 50 L 100 50';
    }
    return getPath(); 
  };

  const pathLength = shape === 'cross' || shape === 'vertical' || shape === 'horizontal' ? 100 : 100; // rough approx for corners too to keep math simple.

  // Dash array logic for ooze progress.
  const progressRatio = oozeProgress / 100;
  const dashVal = pathLength * progressRatio;
  
  // Reversing draw direction if it entered from the 'end' of the SVG path definition
  // e.g. vertical path is M 50 0 (N) to 50 100 (S). If entry is S, draw bottom up!
  let isReverse = false;
  if (shape === 'vertical' && entryDir === 'S') isReverse = true;
  if (shape === 'horizontal' && entryDir === 'E') isReverse = true;
  if (shape === 'corner-tr' && entryDir === 'E') isReverse = true;
  if (shape === 'corner-br' && entryDir === 'S') isReverse = true;
  if (shape === 'corner-bl' && entryDir === 'S') isReverse = true;
  if (shape === 'corner-tl' && entryDir === 'W') isReverse = true;
  if (shape === 'cross' && entryDir === 'E') isReverse = true;
  if (shape === 'cross' && entryDir === 'S') isReverse = true;

  if (shape === 'start') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        {/* Draw a little stub pointing East (the default exit direction) */}
        <path d="M 50 50 L 100 50" fill="none" className="stroke-accent stroke-[20px]" strokeLinecap="square" />
        <circle cx="50" cy="50" r="30" className="fill-bg-base stroke-accent stroke-[12px]" />
      </svg>
    )
  }

  if (shape === 'empty') {
    return <div className="w-full h-full opacity-10 flex items-center justify-center text-xs font-mono">.</div>;
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Base Path */}
      {shape === 'corner-tr' || shape === 'corner-br' || shape === 'corner-bl' || shape === 'corner-tl' ? (
         <path d={getPath()} fill="none" className={`${baseColor} stroke-[24px]`} strokeLinecap="square" strokeLinejoin="miter" />
      ) : (
         <path d={getPath()} fill="none" className={`${baseColor} stroke-[24px]`} strokeLinecap="square" />
      )}
     
      
      {/* Ooze Path */}
      {oozeProgress > 0 && (
         <path 
           d={getOozePath()} 
           fill="none" 
           className={`${oozeColor} stroke-[16px] drop-shadow-[0_0_8px_rgba(170,59,255,0.8)] transition-all ease-linear`} 
           strokeLinecap="square"
           strokeLinejoin="miter"
           strokeDasharray={pathLength}
           strokeDashoffset={isReverse ? -(pathLength - dashVal) : pathLength - dashVal}
         />
      )}
    </svg>
  );
});
