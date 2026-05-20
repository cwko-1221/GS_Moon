import type { Position } from './types';

export const CELL_SIZE = 40;
export const MAP_COLS = 20;
export const MAP_ROWS = 15;
export const CANVAS_WIDTH = MAP_COLS * CELL_SIZE;
export const CANVAS_HEIGHT = MAP_ROWS * CELL_SIZE;

// Left entry (Original)
export const PATH_LEFT: Position[] = [
  { x: 0, y: 3 },
  { x: 5, y: 3 },
  { x: 5, y: 10 },
  { x: 15, y: 10 },
  { x: 15, y: 5 },
  { x: 19, y: 5 },
];

// Top entry (Middle)
export const PATH_TOP: Position[] = [
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 15, y: 10 },
  { x: 15, y: 5 },
  { x: 19, y: 5 },
];

// Bottom entry
export const PATH_BOTTOM: Position[] = [
  { x: 10, y: 14 },
  { x: 10, y: 10 },
  { x: 15, y: 10 },
  { x: 15, y: 5 },
  { x: 19, y: 5 },
];

export const PATHS = [PATH_LEFT, PATH_TOP, PATH_BOTTOM];

export function getPathPointsArray(): Position[][] {
  return PATHS.map(path => 
    path.map(p => ({
      x: p.x * CELL_SIZE + CELL_SIZE / 2,
      y: p.y * CELL_SIZE + CELL_SIZE / 2,
    }))
  );
}

// Function to calculate distance between two points
export function getDistance(p1: Position, p2: Position) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
