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
): { nextBalls: Ball[]; nextWalls: Wall[] } {
  let nextBalls = balls.map(b => ({ ...b }));
  let nextWalls = walls.map(w => ({ ...w }));
  let lifeLost = false;

  // Move balls
  nextBalls.forEach(ball => {
    let nextX = ball.x + ball.vx * dt;
    let nextY = ball.y + ball.vy * dt;
    let bounceX = false;
    let bounceY = false;

    // Boundary collision (using areas)
    // Actually, balls are constrained to the areas they are currently in.
    // To simplify: test collision with all built walls and game boundaries
    
    // Bounds check
    if (nextX - ball.radius < 0) { nextX = ball.radius; bounceX = true; }
    if (nextX + ball.radius > GAME_WIDTH) { nextX = GAME_WIDTH - ball.radius; bounceX = true; }
    if (nextY - ball.radius < 0) { nextY = ball.radius; bounceY = true; }
    if (nextY + ball.radius > GAME_HEIGHT) { nextY = GAME_HEIGHT - ball.radius; bounceY = true; }

    // Wall collision
    for (const wall of nextWalls) {
      const wx = Math.min(wall.startX, wall.endX) - WALL_THICKNESS/2;
      const wy = Math.min(wall.startY, wall.endY) - WALL_THICKNESS/2;
      let ww = wall.orientation === 'horizontal' ? Math.abs(wall.endX - wall.startX) : WALL_THICKNESS;
      let wh = wall.orientation === 'vertical' ? Math.abs(wall.endY - wall.startY) : WALL_THICKNESS;

      if (wall.state === 'building') {
        // Special calculation for building wall
        // A building wall extends in both directions from startX, startY
        const currentLength = wall.progress * WALL_BUILD_SPEED; // this is not quite right if dt is small
        // We will update wall progress below. We use the updated wall for collision.
      } else {
        if (circleRectCollide(nextX, ball.y, ball.radius, wx, wy, ww, wh)) bounceX = true;
        if (circleRectCollide(ball.x, nextY, ball.radius, wx, wy, ww, wh)) bounceY = true;
      }
    }

    if (bounceX) ball.vx *= -1;
    if (bounceY) ball.vy *= -1;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
  });

  // Update building walls
  nextWalls.forEach(wall => {
    if (wall.state === 'building') {
      const addedLen = WALL_BUILD_SPEED * dt;
      let newLength = wall.progress + addedLen;

      // Calculate wall rect based on newLength
      // Two segments extending from startX, startY
      // Need to handle collisions with other walls or boundaries to stop building
      
      // We will simplify and say 'progress' is the total length added in both directions
      let stopDir1 = false;
      let stopDir2 = false;
      
      // Let's implement a simpler wall building: progress goes from 0 to max distance to edge
      // For a robust implementation, a wall extends from its origin in both directions
      // until it hits another wall or the edge.
      
      // Let's just track current extending ends
      const ext1 = newLength; // e.g. going negative
      const ext2 = newLength; // e.g. going positive

      // Check ball collisions with the *building* wall
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

      if (lifeLost) {
        wall.state = 'built'; // It will be removed later
      } else {
        wall.progress = newLength;
        // In a real implementation, we'd check if it hits boundaries/other walls to finalize
        // For simplicity, we just cap it at a large number for now.
        if (wall.progress > GAME_WIDTH + GAME_HEIGHT) {
           wall.state = 'built';
           // Find intersection to truncate endX and endY
           if (wall.orientation === 'horizontal') {
             wall.endX = wall.startX + GAME_WIDTH; // Simplified
             wall.startX = wall.startX - GAME_WIDTH;
           } else {
             wall.endY = wall.startY + GAME_HEIGHT;
             wall.startY = wall.startY - GAME_HEIGHT;
           }
           onWallBuilt(wall.id);
        }
      }
    }
  });

  if (lifeLost) {
    onLifeLost();
    nextWalls = nextWalls.filter(w => w.state === 'built'); // Remove the building wall
  }

  return { nextBalls, nextWalls };
}
