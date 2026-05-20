import type { GameState, Enemy, Position } from './types';
import { TOWER_TYPES } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE, getPathPointsArray, getDistance, PATHS } from './Map';

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private onStateChange: (state: GameState) => void;
  private lastTime: number = 0;
  private animationId: number = 0;
  private allPathPoints: Position[][] = getPathPointsArray();
  
  // Wave configuration
  private enemiesToSpawn: number = 0;
  private spawnTimer: number = 0;
  private spawnInterval: number = 1.0; // seconds
  private images: Record<string, HTMLCanvasElement> = {};

  constructor(ctx: CanvasRenderingContext2D, onStateChange: (state: GameState) => void) {
    this.ctx = ctx;
    this.onStateChange = onStateChange;
    this.state = {
      money: 100,
      health: 20,
      wave: 1,
      phase: 'BUILDING',
      enemies: [],
      towers: [],
      bullets: [],
    };

    const imageNames = ['enemy', 'enemy_fast', 'enemy_tank', 'enemy_boss', 'basic_tower', 'laser_tower', 'sniper_tower', 'plasma_tower'];
    for (const name of imageNames) {
      this.loadAndProcessImage(name, `/${name}.png`);
    }
  }

  private loadAndProcessImage(name: string, src: string) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Background removal (AI images might have dark or white backgrounds)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          // If pixel is very dark (black background)
          if (r < 45 && g < 45 && b < 45) {
             const maxVal = Math.max(r, g, b);
             if (maxVal < 20) {
               data[i+3] = 0; // Fully transparent
             } else {
               data[i+3] = Math.floor(((maxVal - 20) / 25) * 255); // Partial transparency for smooth edge
             }
          }
          // If pixel is very bright (white background)
          else if (r > 210 && g > 210 && b > 210) {
             const minVal = Math.min(r, g, b);
             if (minVal > 240) {
               data[i+3] = 0; // Fully transparent
             } else {
               data[i+3] = Math.floor(((240 - minVal) / 30) * 255); // Partial transparency for smooth edge
             }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        this.images[name] = canvas;
      }
    };
  }

  public start() {
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.loop);
    this.notifyStateChange();
  }

  public stop() {
    cancelAnimationFrame(this.animationId);
  }

  public getState() {
    return this.state;
  }

  public addMoney(amount: number) {
    this.state.money += amount;
    this.notifyStateChange();
  }

  public startWave() {
    if (this.state.phase === 'BUILDING') {
      this.state.phase = 'COMBAT';
      
      if (this.state.wave % 5 === 0) {
        this.enemiesToSpawn = 1; // Boss wave
        this.spawnInterval = 3.0;
      } else {
        this.enemiesToSpawn = 5 + this.state.wave * 2;
        this.spawnInterval = 1.0;
      }
      this.spawnTimer = 0;
      this.notifyStateChange();
    }
  }

  public placeTower(gridX: number, gridY: number, type: 'BASIC' | 'LASER' | 'SNIPER' | 'PLASMA') {
    if (this.state.phase !== 'BUILDING') return false;
    
    // Check if on any path
    const isOnPath = PATHS.some(path => path.some(p => p.x === gridX && p.y === gridY));
    if (isOnPath) return false;

    // Check if already occupied
    const isOccupied = this.state.towers.some(t => t.x === gridX && t.y === gridY);
    if (isOccupied) return false;

    const towerDef = TOWER_TYPES[type];
    if (this.state.money >= towerDef.cost) {
      this.state.money -= towerDef.cost;
      this.state.towers.push({
        id: Math.random().toString(36).substr(2, 9),
        x: gridX,
        y: gridY,
        type,
        range: towerDef.range,
        damage: towerDef.damage,
        fireRate: towerDef.fireRate,
        lastFired: 0,
        level: 1,
        color: towerDef.color
      });
      this.notifyStateChange();
      return true;
    }
    return false;
  }

  private loop = (time: number) => {
    const dt = (time - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = time;

    this.update(dt);
    this.draw();

    if (this.state.phase !== 'GAME_OVER') {
      this.animationId = requestAnimationFrame(this.loop);
    }
  };

  private update(dt: number) {
    if (this.state.phase === 'COMBAT') {
      this.spawnEnemies(dt);
      this.updateEnemies(dt);
      this.updateTowers();
      this.updateBullets(dt);
      this.checkWaveEnd();
    }
  }

  private spawnEnemies(dt: number) {
    if (this.enemiesToSpawn > 0) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.enemiesToSpawn--;
        
        // Pick a random path
        const pathId = Math.floor(Math.random() * this.allPathPoints.length);
        const startPoint = this.allPathPoints[pathId][0];
        
        let type: 'STANDARD' | 'FAST' | 'TANK' | 'BOSS' = 'STANDARD';
        
        if (this.state.wave % 5 === 0) {
           type = 'BOSS';
        } else {
           const rand = Math.random();
           if (this.state.wave >= 3) {
             if (rand < 0.2) type = 'TANK';
             else if (rand < 0.5) type = 'FAST';
           } else if (this.state.wave >= 2) {
             if (rand < 0.3) type = 'FAST';
           }
        }
        
        // Scale enemy stats by wave
        const hpMultiplier = 1 + (this.state.wave * 0.2);
        
        let hp = 100 * hpMultiplier;
        let speed = 60;
        let reward = 5;
        
        if (type === 'FAST') {
           hp = 50 * hpMultiplier;
           speed = 120;
           reward = 8;
        } else if (type === 'TANK') {
           hp = 250 * hpMultiplier;
           speed = 40;
           reward = 15;
        } else if (type === 'BOSS') {
           hp = 1500 * hpMultiplier;
           speed = 30;
           reward = 500; // Big reward for defeating boss
        }
        
        this.state.enemies.push({
          id: Math.random().toString(36).substr(2, 9),
          type,
          x: startPoint.x,
          y: startPoint.y,
          hp,
          maxHp: hp,
          speed,
          pathId: pathId,
          pathIndex: 1,
          reward
        });
      }
    }
  }

  private updateEnemies(dt: number) {
    for (let i = this.state.enemies.length - 1; i >= 0; i--) {
      const enemy = this.state.enemies[i];
      const targetPoint = this.allPathPoints[enemy.pathId][enemy.pathIndex];
      
      if (!targetPoint) {
        // Reached end
        this.state.health -= 1;
        this.state.enemies.splice(i, 1);
        this.notifyStateChange();
        if (this.state.health <= 0) {
          this.state.phase = 'GAME_OVER';
          this.notifyStateChange();
        }
        continue;
      }

      const dx = targetPoint.x - enemy.x;
      const dy = targetPoint.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const moveAmount = enemy.speed * dt;

      if (dist <= moveAmount) {
        enemy.x = targetPoint.x;
        enemy.y = targetPoint.y;
        enemy.pathIndex++;
      } else {
        enemy.x += (dx / dist) * moveAmount;
        enemy.y += (dy / dist) * moveAmount;
      }
    }
  }

  private updateTowers() {
    const timeNow = performance.now() / 1000;
    
    for (const tower of this.state.towers) {
      const towerPixelX = tower.x * CELL_SIZE + CELL_SIZE / 2;
      const towerPixelY = tower.y * CELL_SIZE + CELL_SIZE / 2;

      // Find target
      let target: Enemy | null = null;
      let minTargetDist = tower.range;

      for (const enemy of this.state.enemies) {
        const dist = getDistance({ x: towerPixelX, y: towerPixelY }, { x: enemy.x, y: enemy.y });
        if (dist <= tower.range && dist < minTargetDist) {
          minTargetDist = dist;
          target = enemy;
        }
      }

      if (target) {
        const timeSinceLastFired = timeNow - tower.lastFired;
        if (timeSinceLastFired >= 1 / tower.fireRate) {
          // Fire
          tower.lastFired = timeNow;
          this.state.bullets.push({
            id: Math.random().toString(36).substr(2, 9),
            x: towerPixelX,
            y: towerPixelY,
            targetId: target.id,
            speed: tower.type === 'SNIPER' ? 1200 : 300,
            damage: tower.damage,
            color: tower.color,
            splashRadius: tower.type === 'PLASMA' ? 100 : undefined
          });
        }
      }
    }
  }

  private updateBullets(dt: number) {
    for (let i = this.state.bullets.length - 1; i >= 0; i--) {
      const bullet = this.state.bullets[i];
      const target = this.state.enemies.find(e => e.id === bullet.targetId);

      if (!target) {
        this.state.bullets.splice(i, 1);
        continue;
      }

      const dx = target.x - bullet.x;
      const dy = target.y - bullet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const moveAmount = bullet.speed * dt;

      if (dist <= moveAmount) {
        // Hit
        if (bullet.splashRadius) {
          // AOE
          for (const e of this.state.enemies) {
            const edist = getDistance({ x: bullet.x, y: bullet.y }, { x: e.x, y: e.y });
            if (edist <= bullet.splashRadius) {
              e.hp -= bullet.damage;
            }
          }
        } else {
          // Single target
          target.hp -= bullet.damage;
        }
        this.state.bullets.splice(i, 1);
      } else {
        bullet.x += (dx / dist) * moveAmount;
        bullet.y += (dy / dist) * moveAmount;
      }
    }

    // Clean up dead enemies
    for (let i = this.state.enemies.length - 1; i >= 0; i--) {
      if (this.state.enemies[i].hp <= 0) {
        this.state.money += this.state.enemies[i].reward;
        this.state.enemies.splice(i, 1);
        this.notifyStateChange();
      }
    }
  }

  private checkWaveEnd() {
    if (this.enemiesToSpawn === 0 && this.state.enemies.length === 0 && this.state.phase === 'COMBAT') {
      this.state.phase = 'BUILDING';
      this.state.wave++;
      this.notifyStateChange();
    }
  }

  private notifyStateChange() {
    // Only call this on significant changes to avoid too many react renders
    this.onStateChange({ ...this.state });
  }

  private draw() {
    // Clear canvas
    this.ctx.fillStyle = '#0f172a'; // Dark sci-fi background
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.drawGrid();
    this.drawPath();
    this.drawTowers();
    this.drawEnemies();
    this.drawBullets();
  }

  private drawGrid() {
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, CANVAS_HEIGHT);
      this.ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(CANVAS_WIDTH, y);
      this.ctx.stroke();
    }
  }

  private drawPath() {
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    for (const path of this.allPathPoints) {
      this.ctx.lineWidth = CELL_SIZE;
      this.ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        if (i === 0) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();
      
      // Draw neon inner line
      this.ctx.strokeStyle = '#00f3ff22';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.strokeStyle = '#334155'; // reset for next path
    }
  }

  private drawTowers() {
    for (const tower of this.state.towers) {
      const px = tower.x * CELL_SIZE + CELL_SIZE / 2;
      const py = tower.y * CELL_SIZE + CELL_SIZE / 2;

      const imgName = tower.type.toLowerCase() + '_tower';
      const img = this.images[imgName];

      if (img) {
        const drawSize = CELL_SIZE * 1.5;
        this.ctx.drawImage(img, px - drawSize / 2, py - drawSize / 2, drawSize, drawSize);
      } else {
        // Draw base
        this.ctx.fillStyle = '#1e293b';
        this.ctx.strokeStyle = tower.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(px, py, CELL_SIZE / 2 - 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw core
        this.ctx.fillStyle = tower.color;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw shadow/glow
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = tower.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset
      }
    }
  }

  private drawEnemies() {
    for (const enemy of this.state.enemies) {
      let imgName = 'enemy';
      if (enemy.type === 'FAST') imgName = 'enemy_fast';
      else if (enemy.type === 'TANK') imgName = 'enemy_tank';
      else if (enemy.type === 'BOSS') imgName = 'enemy_boss';

      const img = this.images[imgName];
      if (img) {
        let drawSize = CELL_SIZE * 1.2;
        if (enemy.type === 'BOSS') drawSize = CELL_SIZE * 2.5;
        else if (enemy.type === 'TANK') drawSize = CELL_SIZE * 1.5;
        else if (enemy.type === 'FAST') drawSize = CELL_SIZE * 0.9;

        this.ctx.drawImage(img, enemy.x - drawSize / 2, enemy.y - drawSize / 2, drawSize, drawSize);
      } else {
        // Draw body
        this.ctx.fillStyle = '#ff003c';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#ff003c';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }

      // Draw health bar
      const hpPercent = enemy.hp / enemy.maxHp;
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(enemy.x - 12, enemy.y - 18, 24, 4);
      this.ctx.fillStyle = '#22c55e';
      this.ctx.fillRect(enemy.x - 12, enemy.y - 18, 24 * hpPercent, 4);
    }
  }

  private drawBullets() {
    for (const bullet of this.state.bullets) {
      this.ctx.fillStyle = bullet.color;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = bullet.color;
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }
}
