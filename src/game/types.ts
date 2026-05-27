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
  totalCost: number; // Total money invested (for sell refund)
  hp: number;
  maxHp: number;
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
  buildTimeLeft: number;
}

export const TOWER_TYPES = {
  BASIC: {
    cost: 50,
    upgradeCost: 40,
    maxLevel: 5,
    range: 120,
    damage: 20,
    fireRate: 1.5,
    color: '#00f3ff',
    baseHp: 100
  },
  LASER: {
    cost: 150,
    upgradeCost: 100,
    maxLevel: 5,
    range: 180,
    damage: 4,
    fireRate: 6,
    color: '#ff003c',
    baseHp: 150
  },
  SNIPER: {
    cost: 300,
    upgradeCost: 200,
    maxLevel: 5,
    range: 400,
    damage: 150,
    fireRate: 0.3,
    color: '#eab308',
    baseHp: 80
  },
  PLASMA: {
    cost: 400,
    upgradeCost: 250,
    maxLevel: 5,
    range: 150,
    damage: 40,
    fireRate: 1.0,
    color: '#a855f7',
    baseHp: 200
  }
};
