import type { Ball, Wall, Rect, Coordinates, WallOrientation } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const WALL_THICKNESS = 10;
export const BALL_RADIUS = 8;
export const BALL_SPEED_BASE = 200; // pixels per second
export const WALL_BUILD_SPEED = 400; // pixels per second

export function createInitialBalls(level: number): Ball[] {
  return Array.from({ length: level + 1 }, (_, i) => ({
    id: i,
    x: GAME_WIDTH / 2 + (Math.random() - 0.5) * 100,
    y: GAME_HEIGHT / 2 + (Math.random() - 0.5) * 100,
    vx: (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED_BASE + level * 10),
    vy: (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED_BASE + level * 10),
    radius: BALL_RADIUS,
  }));
}

function circleRectCollide(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number) {
  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx;
  else if (cx > rx + rw) testX = rx + rw;

  if (cy < ry) testY = ry;
  else if (cy > ry + rh) testY = ry + rh;

  const distX = cx - testX;
  const distY = cy - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  return distance <= cr;
}

export function updatePhysics(
  balls: Ball[],
  walls: Wall[],
  areas: Rect[],
  dt: number,
  onLifeLost: () => void,
  onWallBuilt: (wallId: number) => void
): { nextBalls: Ball[]; nextWalls: Wall[]; nextAreas: Rect[] } {
  let nextBalls = balls.map(b => ({ ...b }));
  let nextWalls = walls.map(w => ({ ...w }));
  let nextAreas = areas.map(a => ({ ...a }));
  let lifeLost = false;

  // Move balls and bounce off their containing area bounds
  nextBalls.forEach(ball => {
    let nextX = ball.x + ball.vx * dt;
    let nextY = ball.y + ball.vy * dt;
    let bounceX = false;
    let bounceY = false;

    // Find the specific un-filled area the ball is inside
    const ballArea = nextAreas.find(a => !a.filled && ball.x >= a.x && ball.x <= a.x + a.w && ball.y >= a.y && ball.y <= a.y + a.h) 
                     || { x: 0, y: 0, w: GAME_WIDTH, h: GAME_HEIGHT };

    if (nextX - ball.radius < ballArea.x) { nextX = ballArea.x + ball.radius; bounceX = true; }
    if (nextX + ball.radius > ballArea.x + ballArea.w) { nextX = ballArea.x + ballArea.w - ball.radius; bounceX = true; }
    if (nextY - ball.radius < ballArea.y) { nextY = ballArea.y + ball.radius; bounceY = true; }
    if (nextY + ball.radius > ballArea.y + ballArea.h) { nextY = ballArea.y + ballArea.h - ball.radius; bounceY = true; }

    // Optional: bounce off building walls (if they don't lose a life immediately, but JezzBall logic says life is lost)
    // So we don't bounce off building walls.

    if (bounceX) ball.vx *= -1;
    if (bounceY) ball.vy *= -1;

    ball.x = nextX;
    ball.y = nextY;
  });

  // Ball-ball collisions
  for (let i = 0; i < nextBalls.length; i++) {
    for (let j = i + 1; j < nextBalls.length; j++) {
      const b1 = nextBalls[i];
      const b2 = nextBalls[j];
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distSq = dx * dx + dy * dy;
      const minDist = b1.radius + b2.radius;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq) || 1; // prevent divide by zero
        const nx = dx / dist;
        const ny = dy / dist;

        // Relative velocity
        const dvx = b1.vx - b2.vx;
        const dvy = b1.vy - b2.vy;
        const relativeVelAlongNormal = dvx * nx + dvy * ny;

        // Only resolve if moving towards each other
        if (relativeVelAlongNormal > 0) {
          // Perfectly elastic collision (equal mass)
          b1.vx -= relativeVelAlongNormal * nx;
          b1.vy -= relativeVelAlongNormal * ny;
          b2.vx += relativeVelAlongNormal * nx;
          b2.vy += relativeVelAlongNormal * ny;
        }

        // Separate them to prevent sticking
        const overlap = minDist - dist;
        b1.x -= (overlap / 2) * nx;
        b1.y -= (overlap / 2) * ny;
        b2.x += (overlap / 2) * nx;
        b2.y += (overlap / 2) * ny;
      }
    }
  }

  // Update building walls
  nextWalls.forEach(wall => {
    if (wall.state === 'building') {
      const addedLen = WALL_BUILD_SPEED * dt;
      wall.progress += addedLen;

      const area = nextAreas.find(a => !a.filled && wall.startX >= a.x && wall.startX <= a.x + a.w && wall.startY >= a.y && wall.startY <= a.y + a.h);
      if (!area) {
        wall.state = 'built'; // gracefully handle if somehow placed out of bounds
        return;
      }

      const distLeft = wall.orientation === 'horizontal' ? wall.startX - area.x : wall.startY - area.y;
      const distRight = wall.orientation === 'horizontal' ? area.x + area.w - wall.startX : area.y + area.h - wall.startY;
      
      const ext1 = Math.min(wall.progress, distLeft);
      const ext2 = Math.min(wall.progress, distRight);

      // Check ball collisions with the building wall to destroy wall
      let buildingWx, buildingWy, buildingWw, buildingWh;
      if (wall.orientation === 'horizontal') {
        buildingWx = wall.startX - ext1;
        buildingWy = wall.startY - WALL_THICKNESS/2;
        buildingWw = ext1 + ext2;
        buildingWh = WALL_THICKNESS;
      } else {
        buildingWx = wall.startX - WALL_THICKNESS/2;
        buildingWy = wall.startY - ext1;
        buildingWw = WALL_THICKNESS;
        buildingWh = ext1 + ext2;
      }

      nextBalls.forEach(ball => {
        if (circleRectCollide(ball.x, ball.y, ball.radius, buildingWx, buildingWy, buildingWw, buildingWh)) {
          lifeLost = true;
        }
      });

      if (!lifeLost && wall.progress >= Math.max(distLeft, distRight)) {
        // Wall completed building!
        wall.state = 'built';
        
        // Update wall coords to span the area exactly (for rendering)
        if (wall.orientation === 'horizontal') {
          wall.startX = area.x;
          wall.endX = area.x + area.w;
        } else {
          wall.startY = area.y;
          wall.endY = area.y + area.h;
        }
        onWallBuilt(wall.id);

        // Split the area
        let area1: Rect, area2: Rect;
        if (wall.orientation === 'horizontal') {
          area1 = { x: area.x, y: area.y, w: area.w, h: wall.startY - WALL_THICKNESS/2 - area.y };
          area2 = { x: area.x, y: wall.startY + WALL_THICKNESS/2, w: area.w, h: area.y + area.h - (wall.startY + WALL_THICKNESS/2) };
        } else {
          area1 = { x: area.x, y: area.y, w: wall.startX - WALL_THICKNESS/2 - area.x, h: area.h };
          area2 = { x: wall.startX + WALL_THICKNESS/2, y: area.y, w: area.x + area.w - (wall.startX + WALL_THICKNESS/2), h: area.h };
        }

        // Assign balls to areas
        const balls1 = nextBalls.filter(b => b.x >= area1.x && b.x <= area1.x + area1.w && b.y >= area1.y && b.y <= area1.y + area1.h);
        const balls2 = nextBalls.filter(b => b.x >= area2.x && b.x <= area2.x + area2.w && b.y >= area2.y && b.y <= area2.y + area2.h);

        // If an area has no balls, mark it as filled
        if (balls1.length === 0) area1.filled = true;
        if (balls2.length === 0) area2.filled = true;

        // Replace the old area with the two new ones
        nextAreas = nextAreas.filter(a => a !== area);
        // Only keep areas with positive dimensions
        if (area1.w > 0 && area1.h > 0) nextAreas.push(area1);
        if (area2.w > 0 && area2.h > 0) nextAreas.push(area2);
      }
    }
  });

  if (lifeLost) {
    onLifeLost();
    nextWalls = nextWalls.filter(w => w.state === 'built'); // Remove the building wall
  }

  return { nextBalls, nextWalls, nextAreas };
}
