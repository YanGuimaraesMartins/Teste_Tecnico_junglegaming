import { Container, Sprite } from 'pixi.js';
import type { Rect } from '../collision';

export class Island {
  public container: Container;

  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.container = new Container();
    this.container.x = x;
    this.container.y = y;

    const sprite = Sprite.from('/assets/island.png');
    sprite.width = width;
    sprite.height = height;

    this.container.addChild(sprite);
  }

  public getCollider(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
