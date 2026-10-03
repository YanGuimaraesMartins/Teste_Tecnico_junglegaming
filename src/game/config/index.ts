

// ─── Core Configurations ───────────────────────────────────────────────────

export interface PlayerConfig {
  maxSpeed: number;           // pixels or tiles per second
  acceleration: number;
  rotationSpeed: number;      // degrees or radians per second
  initialHP: number;
  frontalCannonCooldown: number; // milliseconds
  lateralCannonCooldown: number; // milliseconds
}

export interface EnemyConfig {
  chaser: {
    speedPercentOfPlayer: number; // e.g. 0.6 to 0.8
    damage: number;               // typically 1
    hp: number;                   // typically 1
    scoreValue: number;           // typically 0 (self-destructs)
  };
  shooter: {
    attackRange: number;          // tiles
    fireCooldown: number;         // milliseconds
    damage: number;               // typically 1
    hp: number;                   // typically 1
    scoreValue: number;           // typically 10
  };
}

export interface ProjectileConfig {
  speed: number;              // pixels or tiles per second
  ttl: number;                // milliseconds
  damage: number;             // typically 1
}

export interface SpawnConfig {
  interval: number;           // milliseconds (can be overridden by GameConfig)
  maxConcurrent: number;
  safeDistance: number;       // tiles away from player
}

/**
 * GameConfig contains all balance numbers and settings.
 * A subset of this (arena width/height, session duration, spawn interval, seed)
 * is sent to the API as MatchConfig.
 */
export interface GameConfig {
  // Arena settings
  arenaWidth: number;         // tiles
  arenaHeight: number;        // tiles
  tileSize: number;           // pixels per tile (visual only, can be part of GameConfig)
  seed: number;               // RNG seed for deterministic runs

  // Match settings
  sessionDuration: number;    // seconds

  // Entity configurations
  player: PlayerConfig;
  enemy: EnemyConfig;
  projectile: ProjectileConfig;
  spawn: SpawnConfig;
}

// ─── Default Configurations ────────────────────────────────────────────────

export const DEFAULT_GAME_CONFIG: GameConfig = {
  arenaWidth: 30,
  arenaHeight: 30,
  tileSize: 64, // e.g. 64x64 pixels per tile
  seed: Math.floor(Math.random() * 1000000),

  sessionDuration: 180, // 3 minutes by default

  player: {
    maxSpeed: 300,
    acceleration: 600,
    rotationSpeed: 180, // degrees per second
    initialHP: 3,
    frontalCannonCooldown: 500, // 500ms
    lateralCannonCooldown: 1000, // 1000ms
  },

  enemy: {
    chaser: {
      speedPercentOfPlayer: 0.7,
      damage: 1,
      hp: 1,
      scoreValue: 1,
    },
    shooter: {
      attackRange: 5, // tiles
      fireCooldown: 2000, // 2000ms
      damage: 1,
      hp: 1,
      scoreValue: 1,
    },
  },

  projectile: {
    speed: 600,
    ttl: 2000, // 2s
    damage: 1,
  },

  spawn: {
    interval: 3000, // default spawn interval (can be configured via Options)
    maxConcurrent: 10,
    safeDistance: 5,
  }
};

// ─── Match and State Types ─────────────────────────────────────────────────

export type MatchStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'AUTO_PAUSED' | 'FINISHED';
export type EndReason = 'timeout' | 'death';

export interface GameState {
  status: MatchStatus;
  score: number;
  timeRemaining: number;      // milliseconds
  playerHP: number;
  isPaused: boolean;
  endReason: EndReason | null;
}

export interface MatchResult {
  score: number;
  duration: number;           // effective duration in seconds
  endReason: EndReason;
  status: 'pending' | 'saved' | 'error';
}

export interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  duration: number;
  date: string; // ISO string
}
