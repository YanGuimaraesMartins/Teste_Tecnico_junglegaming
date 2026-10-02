import { Chaser } from '../entities/Chaser';
import { Shooter } from '../entities/Shooter';
import type { Enemy } from '../entities/Enemy';
import type { Player } from '../entities/Player';
import type { Island } from '../entities/Island';
import type { GameConfig } from '../config';
import { RNG } from '../utils/rng';
import { checkAABB } from '../collision';

export class Spawner {
  private rng: RNG;
  private lastSpawnTime: number = 0;

  constructor(seed: number) {
    this.rng = new RNG(seed);
  }
  
  public resetSeed(seed: number) {
    this.rng = new RNG(seed);
  }

  public update(
    now: number, 
    enemies: Enemy[], 
    player: Player, 
    islands: Island[], 
    config: GameConfig, 
    screenWidth: number, 
    screenHeight: number
  ): Enemy | null {
    if (enemies.length >= config.spawn.maxConcurrent) {
      return null;
    }
    
    if (now - this.lastSpawnTime < config.spawn.interval) {
      return null;
    }
    
    this.lastSpawnTime = now;
    
    // Find safe spawn
    let spawnX = 0;
    let spawnY = 0;
    let safe = false;
    let attempts = 0;
    
    const safeDistSq = (config.spawn.safeDistance * config.tileSize) ** 2;
    
    while (!safe && attempts < 10) {
      spawnX = this.rng.nextInt(50, screenWidth - 50);
      spawnY = this.rng.nextInt(50, screenHeight - 50);
      
      const distToPlayerSq = (spawnX - player.x) ** 2 + (spawnY - player.y) ** 2;
      
      if (distToPlayerSq >= safeDistSq) {
        // Check islands
        const tempRect = { x: spawnX - 16, y: spawnY - 16, width: 32, height: 32 };
        let hitIsland = false;
        for (const island of islands) {
          if (checkAABB(tempRect, island.getCollider())) {
            hitIsland = true;
            break;
          }
        }
        
        if (!hitIsland) {
          safe = true;
        }
      }
      attempts++;
    }
    
    if (!safe) return null; // Wait for next tick if no safe spot found
    
    // Determine type (e.g. 50/50 Chaser/Shooter)
    const isChaser = this.rng.nextFloat() > 0.5;
    
    if (isChaser) {
      return new Chaser(spawnX, spawnY, config);
    } else {
      return new Shooter(spawnX, spawnY, config);
    }
  }
}
