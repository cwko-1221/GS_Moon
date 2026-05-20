export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  type: 'STANDARD' | 'FAST' | 'TANK' | 'BOSS';
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  pathId: number; // Which path array to follow
  pathIndex: number; // The current target point in the path
  reward: number; // Small reward for killing
}

export interface Tower {
  id: string;
  x: number; // Grid X
  y: number; // Grid Y
  type: 'BASIC' | 'LASER' | 'SNIPER' | 'PLASMA';
  range: number;
  damage: number;
  fireRate: number; // Shots per second
  lastFired: number; // Timestamp
  level: number;
  color: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  targetId: string;
  speed: number;
  damage: number;
  color: string;
  splashRadius?: number;
}

export interface GameState {
  money: number;
  health: number;
  wave: number;
  phase: 'BUILDING' | 'COMBAT' | 'GAME_OVER';
  enemies: Enemy[];
  towers: Tower[];
  bullets: Bullet[];
}

export const TOWER_TYPES = {
  BASIC: {
    cost: 50,
    range: 120,
    damage: 20,
    fireRate: 1.5,
    color: '#00f3ff'
  },
  LASER: {
    cost: 150,
    range: 200,
    damage: 5, // Low damage but high fire rate
    fireRate: 10,
    color: '#ff003c'
  },
  SNIPER: {
    cost: 300,
    range: 400,
    damage: 150, // Massive damage
    fireRate: 0.3, // Very slow
    color: '#eab308'
  },
  PLASMA: {
    cost: 400,
    range: 150,
    damage: 40,
    fireRate: 1.0,
    color: '#a855f7' // Purple
  }
};
