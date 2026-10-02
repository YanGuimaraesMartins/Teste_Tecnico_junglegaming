import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { Island } from './Island';
import type { GameConfig } from '../config';
import { checkAABB } from '../collision';

export class Chaser extends Enemy {
  constructor(x: number, y: number, config: GameConfig) {
    super(x, y, config.enemy.chaser.hp, config.enemy.chaser.scoreValue, '/assets/chaser.png');
  }

  public update(
    deltaSeconds: number, 
    player: Player, 
    islands: Island[], 
    config: GameConfig
  ): void {
    if (this.isDestroyed) return;

    // Direction to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      const speed = config.player.maxSpeed * config.enemy.chaser.speedPercentOfPlayer;
      
      const moveX = (dx / dist) * speed * deltaSeconds;
      const moveY = (dy / dist) * speed * deltaSeconds;
      
      // Try horizontal
      this.x += moveX;
      let hit = false;
      for (const island of islands) {
        if (checkAABB(this.getCollider(), island.getCollider())) {
          hit = true; break;
        }
      }
      if (hit) this.x -= moveX; // Undo
      
      // Try vertical
      this.y += moveY;
      hit = false;
      for (const island of islands) {
        if (checkAABB(this.getCollider(), island.getCollider())) {
          hit = true; break;
        }
      }
      if (hit) this.y -= moveY; // Undo
      
      // Update container
      this.container.x = this.x;
      this.container.y = this.y;
      
      // Rotate facing player
      this.container.rotation = Math.atan2(dy, dx);
    }
  }
}
