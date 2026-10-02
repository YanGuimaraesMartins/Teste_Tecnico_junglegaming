import { Container, Graphics } from 'pixi.js';
import type { Circle } from '../collision';

export class Projectile {
  public container: Container;
  private graphics: Graphics;
  
  public x: number;
  public y: number;
  public angle: number; // in radians
  
  public speed: number = 600;
  public ttl: number = 2000;
  public age: number = 0;
  public isDestroyed: boolean = false;
  
  public isEnemy: boolean = false;
  public damage: number = 1;
  
  public radius = 4;

  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    
    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    
    this.graphics = new Graphics()
      .circle(0, 0, this.radius)
      .fill({ color: 0xffff00 });
      
    this.container.addChild(this.graphics);
  }

  public update(deltaSeconds: number) {
    if (this.isDestroyed) return;
    
    this.age += deltaSeconds * 1000;
    if (this.age >= this.ttl) {
      this.destroy();
      return;
    }
    
    this.x += Math.cos(this.angle) * this.speed * deltaSeconds;
    this.y += Math.sin(this.angle) * this.speed * deltaSeconds;
    
    this.container.x = this.x;
    this.container.y = this.y;
  }
  
  public getCollider(): Circle {
    return { x: this.x, y: this.y, radius: this.radius };
  }

  public destroy() {
    this.isDestroyed = true;
    this.container.destroy({ children: true });
  }
}
