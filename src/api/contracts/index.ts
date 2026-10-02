/**
 * API contracts — shared between the app, MSW handlers, and tests.
 * Source of truth: REQUIREMENTS.md (REQ-API-001 through REQ-API-013)
 */

// ─── Match Record ────────────────────────────────────────────────────────────

export interface MatchRecord {
  id: string
  matchId: string
  playerId: string
  playerName: string
  score: number
  duration: number       // effective play duration in seconds (excluding paused time)
  endReason: 'timeout' | 'death'
  config: MatchConfig
  createdAt: string      // ISO 8601
}

export interface MatchConfig {
  sessionDuration: number    // seconds
  enemySpawnInterval: number // seconds
  arenaWidth: number         // tiles
  arenaHeight: number        // tiles
  seed: number
}

// ─── GET /ranking ─────────────────────────────────────────────────────────────

export interface GetRankingParams {
  page: number
  limit?: number
  config?: string   // config hash for fair comparison
}

export interface GetRankingResponse {
  data: MatchRecord[]
  total: number
  page: number
  limit: number
}

// ─── GET /history ─────────────────────────────────────────────────────────────

export interface GetHistoryParams {
  playerId: string
  page: number
  limit?: number
}

export interface GetHistoryResponse {
  data: MatchRecord[]
  total: number
  page: number
  limit: number
}

// ─── POST /match ──────────────────────────────────────────────────────────────

export interface PostMatchBody {
  matchId: string        // UUID v4 generated on client — used for idempotency
  playerId: string
  playerName: string
  score: number
  duration: number
  endReason: 'timeout' | 'death'
  config: MatchConfig
}

export type PostMatchResponse = MatchRecord

// ─── Pending Match (localStorage) ─────────────────────────────────────────────

export interface PendingMatch {
  body: PostMatchBody
  createdAt: string
  retryCount: number
}
