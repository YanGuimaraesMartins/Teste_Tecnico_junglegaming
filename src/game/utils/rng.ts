export class RNG {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // Returns a pseudo-random float between 0 (inclusive) and 1 (exclusive)
  public nextFloat(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  // Returns a pseudo-random integer between min and max (inclusive)
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }
}
