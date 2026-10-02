import { Container, Sprite } from 'pixi.js';
import type { Rect } from '../collision';
import type { PlayerConfig } from '../config';

export class Player {
  public container: Container;
  
  public x: number;
  public y: number;
  public rotation: number = -Math.PI / 2; // facing up
  
  public velocity: number = 0;
  
  public width = 40;
  public height = 40;
  
  public hp: number;
  public lastFireFrontal: number = 0;
  public lastFireLateralLeft: number = 0;
  public lastFireLateralRight: number = 0;
  
  private config: PlayerConfig;

  constructor(x: number, y: number, config: PlayerConfig) {
    this.x = x;
    this.y = y;
    this.config = config;
    this.hp = config.initialHP;
    
    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    
    // Replace graphics with Sprite
    const sprite = Sprite.from('/assets/player.png');
    sprite.anchor.set(0.5);
    sprite.width = 64;
    sprite.height = 64;
    // Rotate by 180 degrees from previous math
    sprite.rotation = -Math.PI / 2;

    this.container.addChild(sprite);
    this.container.rotation = this.rotation;
  }
  
  public update(deltaSeconds: number, input: { forward: boolean, backward: boolean, turnLeft: boolean, turnRight: boolean }) {
    // Rotation
    if (input.turnLeft) {
      this.rotation -= (this.config.rotationSpeed * Math.PI / 180) * deltaSeconds;
    }
    if (input.turnRight) {
      this.rotation += (this.config.rotationSpeed * Math.PI / 180) * deltaSeconds;
    }
    this.container.rotation = this.rotation;
    
    // Acceleration
    if (input.forward) {
      this.velocity += this.config.acceleration * deltaSeconds;
      if (this.velocity > this.config.maxSpeed) this.velocity = this.config.maxSpeed;
    } else if (input.backward) {
      this.velocity -= this.config.acceleration * deltaSeconds;
      // Allow moving backward at half max speed
      if (this.velocity < -this.config.maxSpeed / 2) this.velocity = -this.config.maxSpeed / 2;
    } else {
      // Natural deceleration when no key is pressed
      if (this.velocity > 0) {
        this.velocity -= this.config.acceleration * deltaSeconds;
        if (this.velocity < 0) this.velocity = 0;
      } else if (this.velocity < 0) {
        this.velocity += this.config.acceleration * deltaSeconds;
        if (this.velocity > 0) this.velocity = 0;
      }
    }
    
    // Movement
    this.x += Math.cos(this.rotation) * this.velocity * deltaSeconds;
    this.y += Math.sin(this.rotation) * this.velocity * deltaSeconds;
    
    this.container.x = this.x;
    this.container.y = this.y;
  }
  
  public getCollider(): Rect {
    return { 
      x: this.x - this.width / 2, 
      y: this.y - this.height / 2, 
      width: this.width, 
      height: this.height 
    };
  }
}
