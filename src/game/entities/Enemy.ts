import { Container, Sprite } from 'pixi.js';
import type { Rect } from '../collision';
import type { GameConfig } from '../config';
import type { Player } from './Player';
import type { Island } from './Island';
import type { Projectile } from './Projectile';

export abstract class Enemy {
  public container: Container;
  public x: number;
  public y: number;
  public hp: number;
  public isDestroyed: boolean = false;
  
  public width: number = 64;
  public height: number = 64;
  public scoreValue: number;

  constructor(x: number, y: number, hp: number, scoreValue: number, assetPath: string) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.scoreValue = scoreValue;
    
    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    
    const sprite = Sprite.from(assetPath);
    sprite.anchor.set(0.5);
    sprite.width = this.width;
    sprite.height = this.height;
    sprite.rotation = -Math.PI / 2; // Fixed 180 deg offset
      
    this.container.addChild(sprite);
  }
  
  public takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }
  
  public getCollider(): Rect {
    return { 
      x: this.x - this.width / 2, 
      y: this.y - this.height / 2, 
      width: this.width, 
      height: this.height 
    };
  }

  public destroy() {
    this.isDestroyed = true;
    this.container.destroy({ children: true });
  }

  // Abstract update method for AI logic
  public abstract update(
    deltaSeconds: number, 
    player: Player, 
    islands: Island[], 
    config: GameConfig,
    now: number,
    onShoot: (proj: Projectile) => void
  ): void;
}
