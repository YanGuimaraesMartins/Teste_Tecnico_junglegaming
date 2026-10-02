import { Application, TilingSprite, Texture } from 'pixi.js';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Island } from '../entities/Island';
import { Spawner } from './Spawner';
import { InputManager } from '../input/InputManager';
import { checkAABB, checkCircleAABB } from '../collision';
import { DEFAULT_GAME_CONFIG, type GameConfig, type MatchStatus, type EndReason } from '../config';

export class GameEngine {
  public app: Application;
  public input: InputManager;
  public config: GameConfig;
  
  public player!: Player;
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  public islands: Island[] = [];
  
  public score: number = 0;
  public timeRemaining: number;
  public status: MatchStatus = 'READY';
  public endReason: EndReason | null = null;
  public gameTime: number = 0;
  
  private isRunning: boolean = false;
  private spawner: Spawner;
  
  private onScoreUpdate?: (score: number) => void;
  private onTimeUpdate?: (timeRemaining: number) => void;
  private onStatusUpdate?: (status: MatchStatus) => void;
  private onHpUpdate?: (hp: number) => void;

  constructor(
    app: Application, 
    onScoreUpdate?: (score: number) => void, 
    onTimeUpdate?: (timeRemaining: number) => void, 
    onStatusUpdate?: (status: MatchStatus) => void,
    onHpUpdate?: (hp: number) => void
  ) {
    this.app = app;
    // Deep clone default config
    this.config = JSON.parse(JSON.stringify(DEFAULT_GAME_CONFIG)) as GameConfig;
    
    // Apply Options from localStorage
    const savedSpawn = localStorage.getItem('pb_spawnInterval');
    if (savedSpawn) {
      this.config.spawn.interval = Number(savedSpawn);
    }
    
    this.timeRemaining = this.config.sessionDuration * 1000;
    this.spawner = new Spawner(this.config.seed);
    
    this.onScoreUpdate = onScoreUpdate;
    this.onTimeUpdate = onTimeUpdate;
    this.onStatusUpdate = onStatusUpdate;
    this.onHpUpdate = onHpUpdate;
    this.input = new InputManager();
    this.input.init();
    
    this.setupScene();
    this.setupTestHooks();
    this.setupEventListeners();
    
    this.app.ticker.add(this.update.bind(this));
    this.status = 'RUNNING';
    this.onStatusUpdate?.(this.status);
    this.isRunning = true;
  }
  
  private setupTestHooks() {
    window.__GAME_TEST_HOOKS__ = {
      getState: () => ({
        status: 'RUNNING',
        score: this.score,
        timeRemaining: this.timeRemaining,
        playerHP: this.player.hp,
        isPaused: !this.isRunning,
        endReason: null,
      }),
      setTime: (ms: number) => { this.timeRemaining = ms; },
      setHP: (hp: number) => { this.player.hp = hp; },
      pause: () => { this.isRunning = false; },
      resume: () => { this.isRunning = true; },
      setSeed: (seed: number) => { 
        this.config.seed = seed;
        this.spawner.resetSeed(seed);
      },
      getMatchStatus: () => this.status,
      getEndReason: () => this.endReason,
      forceGameOver: (reason: 'timeout' | 'death') => { 
        this.timeRemaining = 0; 
        this.status = 'FINISHED';
        this.endReason = reason;
        this.isRunning = false;
      },
      restart: () => { 
        this.status = 'RUNNING';
        this.onStatusUpdate?.(this.status);
        this.endReason = null;
        this.isRunning = true;
        this.timeRemaining = this.config.sessionDuration * 1000; 
        this.player.hp = this.config.player.initialHP;
        this.onHpUpdate?.(this.player.hp);
        this.score = 0;
        this.onScoreUpdate?.(this.score);
        this.spawner.resetSeed(this.config.seed);
        
        for (const e of this.enemies) e.destroy();
        this.enemies = [];
        
        for (const p of this.projectiles) p.destroy();
        this.projectiles = [];
        
        this.player.x = this.app.screen.width / 2 - 100;
        this.player.y = this.app.screen.height / 2;
        this.player.velocity = 0;
      },
      getIsPaused: () => !this.isRunning,
    };
  }
  
  private setupScene() {
    // Background Space
    const bgTexture = Texture.from('/assets/background.png');
    const bg = new TilingSprite({
      texture: bgTexture,
      width: this.app.screen.width,
      height: this.app.screen.height,
    });
    this.app.stage.addChild(bg);
    
    // Island
    const island = new Island(this.app.screen.width / 2 + 100, this.app.screen.height / 2, 128, 128);
    this.islands.push(island);
    this.app.stage.addChild(island.container);
    
    // Player
    this.player = new Player(this.app.screen.width / 2 - 100, this.app.screen.height / 2, this.config.player);
    this.app.stage.addChild(this.player.container);
    this.onHpUpdate?.(this.player.hp);
    
    // Enemies will be spawned dynamically
    // No initial enemy in Phase 5 unless spawner adds one
  }
  
  private setupEventListeners() {
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibility);
    window.addEventListener('keydown', this.handleKeyDown);
  }
  
  private handleBlur = () => {
    if (this.status === 'RUNNING') {
      this.status = 'AUTO_PAUSED';
      this.onStatusUpdate?.(this.status);
      this.input.clear(); // Clear all inputs
    }
  }
  
  private handleVisibility = () => {
    if (document.hidden && this.status === 'RUNNING') {
      this.status = 'AUTO_PAUSED';
      this.onStatusUpdate?.(this.status);
      this.input.clear();
    }
  }
  
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'p') {
      if (this.status === 'RUNNING') {
        this.status = 'PAUSED';
        this.onStatusUpdate?.(this.status);
        this.input.clear();
      } else if (this.status === 'PAUSED' || this.status === 'AUTO_PAUSED') {
        this.status = 'RUNNING';
        this.onStatusUpdate?.(this.status);
      }
    } else if (e.key.toLowerCase() === 'r') {
      // Temporary shortcut to restart match for testing
      if (this.status === 'FINISHED') {
        window.__GAME_TEST_HOOKS__?.restart();
      }
    }
  }

  private handleShoot = (proj: Projectile) => {
    this.projectiles.push(proj);
    this.app.stage.addChild(proj.container);
  }

  private update(ticker: { deltaTime: number, deltaMS: number }) {
    if (!this.isRunning) return;
    
    // Only advance game logic if RUNNING
    if (this.status !== 'RUNNING') {
      // We can still trigger some visual only updates if needed, but no gameplay.
      return;
    }
    
    const deltaSeconds = ticker.deltaMS / 1000;
    this.gameTime += ticker.deltaMS;
    const now = this.gameTime;
    
    // 0. Time Update
    this.timeRemaining -= ticker.deltaMS;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.status = 'FINISHED';
      this.endReason = 'timeout';
      this.onStatusUpdate?.(this.status);
      this.isRunning = false;
      return;
    }
    this.onTimeUpdate?.(this.timeRemaining);
  
    // 1. Input & Player Movement
    const inputState = {
      forward: this.input.isKeyDown('w'),
      backward: this.input.isKeyDown('s'),
      turnLeft: this.input.isKeyDown('a'),
      turnRight: this.input.isKeyDown('d'),
    };
    
    const prevX = this.player.x;
    const prevY = this.player.y;
    
    this.player.update(deltaSeconds, inputState);
    
    // Boundary collision for Player
    if (this.player.x < 0 || this.player.x > this.app.screen.width || 
        this.player.y < 0 || this.player.y > this.app.screen.height) {
      this.player.x = prevX;
      this.player.y = prevY;
      this.player.velocity = 0;
    }
    
    // Island collision for Player
    const playerRect = this.player.getCollider();
    for (const island of this.islands) {
      if (checkAABB(playerRect, island.getCollider())) {
        this.player.x = prevX;
        this.player.y = prevY;
        this.player.velocity = 0;
      }
    }
    
    // Player Shooting (Space, Q, E)
    if (this.input.isKeyDown(' ')) {
      if (now - this.player.lastFireFrontal >= this.config.player.frontalCannonCooldown) {
        this.player.lastFireFrontal = now;
        // Fire from the nose of the ship
        const noseX = this.player.x + Math.cos(this.player.rotation) * (this.player.width / 2);
        const noseY = this.player.y + Math.sin(this.player.rotation) * (this.player.height / 2);
        
        const proj = new Projectile(noseX, noseY, this.player.rotation);
        proj.speed = this.config.projectile.speed;
        proj.ttl = this.config.projectile.ttl;
        this.projectiles.push(proj);
        this.app.stage.addChild(proj.container);
      }
    }
    
    // Lateral Left (Q)
    if (this.input.isKeyDown('q')) {
      if (now - this.player.lastFireLateralLeft >= this.config.player.lateralCannonCooldown) {
        this.player.lastFireLateralLeft = now;
        const leftAngle = this.player.rotation - Math.PI / 2;
        // 3 parallel projectiles
        for (let idx = -1; idx <= 1; idx++) {
          const offsetX = Math.cos(this.player.rotation) * (idx * 10);
          const offsetY = Math.sin(this.player.rotation) * (idx * 10);
          const p = new Projectile(this.player.x + offsetX, this.player.y + offsetY, leftAngle);
          p.speed = this.config.projectile.speed;
          p.ttl = this.config.projectile.ttl;
          this.projectiles.push(p);
          this.app.stage.addChild(p.container);
        }
      }
    }
    
    // Lateral Right (E)
    if (this.input.isKeyDown('e')) {
      if (now - this.player.lastFireLateralRight >= this.config.player.lateralCannonCooldown) {
        this.player.lastFireLateralRight = now;
        const rightAngle = this.player.rotation + Math.PI / 2;
        // 3 parallel projectiles
        for (let idx = -1; idx <= 1; idx++) {
          const offsetX = Math.cos(this.player.rotation) * (idx * 10);
          const offsetY = Math.sin(this.player.rotation) * (idx * 10);
          const p = new Projectile(this.player.x + offsetX, this.player.y + offsetY, rightAngle);
          p.speed = this.config.projectile.speed;
          p.ttl = this.config.projectile.ttl;
          this.projectiles.push(p);
          this.app.stage.addChild(p.container);
        }
      }
    }
    
    // 2. AI Update
    for (const enemy of this.enemies) {
      enemy.update(deltaSeconds, this.player, this.islands, this.config, now, this.handleShoot);
      
      // Chaser collision with player
      if (checkAABB(enemy.getCollider(), this.player.getCollider())) {
        this.player.hp -= enemy.hp; // usually 1
        this.onHpUpdate?.(this.player.hp);
        enemy.destroy();
        this.checkPlayerDeath();
      }
    }
    this.enemies = this.enemies.filter(e => !e.isDestroyed);
    
    // 3. Spawner
    const newEnemy = this.spawner.update(now, this.enemies, this.player, this.islands, this.config, this.app.screen.width, this.app.screen.height);
    if (newEnemy) {
      this.enemies.push(newEnemy);
      this.app.stage.addChild(newEnemy.container);
    }
    
    // 4. Projectiles Update & Collisions
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.update(deltaSeconds);
      
      if (proj.isDestroyed) {
        this.projectiles.splice(i, 1);
        continue;
      }
      
      const pCircle = proj.getCollider();
      
      // Hit Island?
      let hitIsland = false;
      for (const island of this.islands) {
        if (checkCircleAABB(pCircle, island.getCollider())) {
          hitIsland = true;
          break;
        }
      }
      
      if (hitIsland || proj.x < 0 || proj.x > this.app.screen.width || proj.y < 0 || proj.y > this.app.screen.height) {
        proj.destroy();
        this.projectiles.splice(i, 1);
        continue;
      }
      
      if (proj.isEnemy) {
        // Hit Player?
        if (checkCircleAABB(pCircle, this.player.getCollider())) {
          this.player.hp -= proj.damage;
          this.onHpUpdate?.(this.player.hp);
          proj.destroy();
          this.projectiles.splice(i, 1);
          this.checkPlayerDeath();
        }
      } else {
        // Hit Enemy?
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (checkCircleAABB(pCircle, enemy.getCollider())) {
            enemy.takeDamage(this.config.projectile.damage);
            proj.destroy();
            this.projectiles.splice(i, 1);
            
            if (enemy.isDestroyed) {
              this.enemies.splice(j, 1);
              this.score += enemy.scoreValue;
              this.onScoreUpdate?.(this.score);
            }
            break; // Projectile can only hit one thing
          }
        }
      }
    }
  }

  private checkPlayerDeath() {
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.onHpUpdate?.(0);
      this.status = 'FINISHED';
      this.endReason = 'death';
      this.onStatusUpdate?.(this.status);
      this.isRunning = false;
    }
  }

  public destroy() {
    this.isRunning = false;
    this.input.destroy();
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
