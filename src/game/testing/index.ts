export interface GameTestHooks {
  getState: () => unknown
  setTime: (ms: number) => void
  setHP: (hp: number) => void
  pause: () => void
  resume: () => void
  setSeed: (seed: number) => void
  getMatchStatus: () => string
  getEndReason: () => string | null
  forceGameOver: (reason: 'timeout' | 'death') => void
  restart: () => void
  getIsPaused: () => boolean
}

declare global {
  interface Window {
    __GAME_TEST_HOOKS__?: GameTestHooks
  }
}

export { }
