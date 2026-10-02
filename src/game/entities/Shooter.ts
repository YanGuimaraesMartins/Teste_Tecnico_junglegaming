import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { Island } from './Island';
import { Projectile } from './Projectile';
import type { GameConfig } from '../config';
import { checkAABB } from '../collision';

export class Shooter extends Enemy {
  private lastFire: number = 0;

  constructor(x: number, y: number, config: GameConfig) {
    super(x, y, config.enemy.shooter.hp, config.enemy.shooter.scoreValue, '/assets/shooter.png');
  }

  public update(
    deltaSeconds: number, 
    player: Player, 
    islands: Island[], 
    config: GameConfig,
    now: number,
    onShoot: (proj: Projectile) => void
  ): void {
    if (this.isDestroyed) return;

    // Direction to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Rotate to face player
    const angle = Math.atan2(dy, dx);
    this.container.rotation = angle;
    
    const attackRangeInPixels = config.enemy.shooter.attackRange * config.tileSize;

    // Movement: Keep distance ~attackRange
    // Simple logic: if too far, move closer. If too close, move away.
    const speed = config.player.maxSpeed * 0.5; // Arbitrary 50% speed for shooter to maneuver
    let moveX = 0;
    let moveY = 0;
    
    if (dist > attackRangeInPixels + 50) {
      // Move closer
      moveX = Math.cos(angle) * speed * deltaSeconds;
      moveY = Math.sin(angle) * speed * deltaSeconds;
    } else if (dist < attackRangeInPixels - 50) {
      // Move away
      moveX = -Math.cos(angle) * speed * deltaSeconds;
      moveY = -Math.sin(angle) * speed * deltaSeconds;
    }
    
    // Apply Movement with Island Collision
    if (moveX !== 0 || moveY !== 0) {
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
    }
    
    this.container.x = this.x;
    this.container.y = this.y;
    
    // Attack
    if (dist <= attackRangeInPixels + 100) {
      if (now - this.lastFire >= config.enemy.shooter.fireCooldown) {
        this.lastFire = now;
        
        // Spawn from the "nose" of the enemy, not the dead center
        const noseX = this.x + Math.cos(angle) * (this.width / 2);
        const noseY = this.y + Math.sin(angle) * (this.height / 2);
        
        const p = new Projectile(noseX, noseY, angle);
        p.speed = config.projectile.speed * 0.8; // Enemy projectiles might be slightly slower
        p.ttl = config.projectile.ttl;
        // Mark as enemy projectile
        p.isEnemy = true;
        
        onShoot(p);
      }
    }
  }
}
