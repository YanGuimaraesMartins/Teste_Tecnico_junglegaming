import { http, HttpResponse, delay } from 'msw'
import type { PostMatchBody, MatchRecord } from '../../api/contracts'
import { scenarioManager } from '../scenarios'

export const getMatches = (): MatchRecord[] => {
  try {
    const data = localStorage.getItem('mock_db_matches')
    return data ? JSON.parse(data) as MatchRecord[] : []
  } catch {
    return []
  }
}

export const saveMatch = (match: MatchRecord) => {
  const matches = getMatches()
  if (!matches.some(m => m.matchId === match.matchId)) {
    matches.push(match)
    localStorage.setItem('mock_db_matches', JSON.stringify(matches))
  }
}

const handleDelay = async (scenario: string, page: number = 1) => {
  if (scenario === 'slow') await delay(3000)
  else if (scenario === 'variable-latency') await delay(Math.random() * 1900 + 100)
  else if (scenario === 'out-of-order') await delay(1000 / page) // Page 1 takes 1s, Page 2 takes 0.5s
  else await delay(300)
}

const checkErrors = (scenario: string, endpoint: 'ranking' | 'history' | 'match') => {
  if (scenario === 'network-error') return HttpResponse.error()
  if (scenario === 'timeout') return HttpResponse.error() // Or we could delay(10000) and return error
  if (scenario === 'http-error-4xx') return HttpResponse.json({ message: 'Bad request' }, { status: 400 })
  if (scenario === 'http-error-5xx') return HttpResponse.json({ message: 'Server error' }, { status: 500 })
  
  if (scenario === 'ranking-fail' && endpoint === 'ranking') return HttpResponse.error()
  if (scenario === 'history-fail' && endpoint === 'history') return HttpResponse.error()

  return null
}

export const handlers = [
  http.get('/api/ranking', async ({ request }) => {
    const scenario = scenarioManager.get()
    const err = checkErrors(scenario, 'ranking')
    if (err) {
      if (scenario === 'timeout') await delay(10000)
      return err
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 10)
    
    await handleDelay(scenario, page)

    if (scenario === 'empty') {
      return HttpResponse.json({ data: [], total: 0, page, limit })
    }

    const allMatches = getMatches().sort((a, b) => b.score - a.score)
    const bestScores = new Map<string, MatchRecord>()
    allMatches.forEach(m => {
      const currentBest = bestScores.get(m.playerId)
      if (!currentBest || m.score > currentBest.score) bestScores.set(m.playerId, m)
    })
    
    const rankingList = Array.from(bestScores.values()).sort((a, b) => b.score - a.score)
    
    let targetList = rankingList
    if (scenario === 'paginated' && targetList.length === 0) {
      // Generate fake fixtures if needed
      for(let i = 0; i < 25; i++) {
        targetList.push({ id: `fake-${i}`, matchId: `m-${i}`, playerId: `p-${i}`, playerName: `Player ${i}`, score: 1000 - i * 10, duration: 60, endReason: 'death', config: { sessionDuration: 60, seed: 42, enemySpawnInterval: 2000, arenaWidth: 800, arenaHeight: 600 }, createdAt: new Date().toISOString() })
      }
    }

    const start = (page - 1) * limit
    const paginated = targetList.slice(start, start + limit)

    return HttpResponse.json({ data: paginated, total: targetList.length, page, limit })
  }),

  http.get('/api/history', async ({ request }) => {
    const scenario = scenarioManager.get()
    const err = checkErrors(scenario, 'history')
    if (err) {
      if (scenario === 'timeout') await delay(10000)
      return err
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 10)
    const playerId = url.searchParams.get('playerId')
    
    await handleDelay(scenario, page)

    if (scenario === 'empty') {
      return HttpResponse.json({ data: [], total: 0, page, limit })
    }

    let history = getMatches().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (playerId) history = history.filter(m => m.playerId === playerId)

    const start = (page - 1) * limit
    const paginated = history.slice(start, start + limit)

    return HttpResponse.json({ data: paginated, total: history.length, page, limit })
  }),

  http.post('/api/match', async ({ request }) => {
    const scenario = scenarioManager.get()
    const body = await request.json() as PostMatchBody
    
    // State to simulate recovery
    const attemptsStr = localStorage.getItem(`match_attempts_${body.matchId}`) || '0'
    const attempts = parseInt(attemptsStr, 10)
    localStorage.setItem(`match_attempts_${body.matchId}`, (attempts + 1).toString())

    if (scenario === 'match-timeout-recover' && attempts === 0) {
      await delay(10000)
      return HttpResponse.error()
    }
    if (scenario === 'match-unavailable-recover' && attempts === 0) {
      await delay(300)
      return HttpResponse.json({ message: 'Service Unavailable' }, { status: 503 })
    }

    const err = checkErrors(scenario, 'match')
    if (err) {
      if (scenario === 'timeout') await delay(10000)
      return err
    }

    const record: MatchRecord = {
      id: crypto.randomUUID(),
      matchId: body.matchId,
      playerId: body.playerId,
      playerName: body.playerName,
      score: body.score,
      duration: body.duration,
      endReason: body.endReason,
      config: body.config,
      createdAt: new Date().toISOString(),
    }
    
    saveMatch(record)
    await handleDelay(scenario)
    
    return HttpResponse.json(record, { status: 201 })
  }),
]
