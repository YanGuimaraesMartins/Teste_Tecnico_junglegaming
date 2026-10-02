export class InputManager {
  private keys: Set<string> = new Set();

  public init() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keys.clear();
  }

  public isKeyDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  private readonly gameKeys = ['w', 'a', 's', 'd', ' ', 'q', 'e', 'p'];

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (this.gameKeys.includes(key)) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      e.preventDefault();
      this.keys.add(key);
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (this.gameKeys.includes(key)) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      e.preventDefault();
      this.keys.delete(key);
    }
  }
  
  public clear() {
    this.keys.clear();
  }
}
