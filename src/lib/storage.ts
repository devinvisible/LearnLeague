export type ChampionLearningState = 'unlearned' | 'intrigue' | 'learned'

const STATE_KEY = 'learnleague_champion_state'
const LEGACY_LEARNED_KEY = 'learnleague_learned_champions'

function readStateMap(): Record<string, 'intrigue' | 'learned'> {
  try {
    const stored = localStorage.getItem(STATE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return {}
}

/** Migrate legacy boolean "learned" list to new state map. */
function migrateLegacyIfNeeded(stateMap: Record<string, 'intrigue' | 'learned'>): Record<string, 'intrigue' | 'learned'> {
  try {
    const legacy = localStorage.getItem(LEGACY_LEARNED_KEY)
    if (!legacy) return stateMap
    const ids: string[] = JSON.parse(legacy)
    let changed = false
    for (const id of ids) {
      if (!(id in stateMap)) {
        stateMap[id] = 'learned'
        changed = true
      }
    }
    if (changed) {
      localStorage.setItem(STATE_KEY, JSON.stringify(stateMap))
      localStorage.removeItem(LEGACY_LEARNED_KEY)
    }
  } catch {
    // Ignore
  }
  return stateMap
}

export function getChampionLearningState(championId: string): ChampionLearningState {
  let map = readStateMap()
  map = migrateLegacyIfNeeded(map)
  return map[championId] ?? 'unlearned'
}

export function setChampionLearningState(championId: string, state: ChampionLearningState): void {
  const map = readStateMap()
  migrateLegacyIfNeeded(map)
  if (state === 'unlearned') {
    delete map[championId]
  } else {
    map[championId] = state
  }
  localStorage.setItem(STATE_KEY, JSON.stringify(map))
}

/** Cycle: unlearned -> intrigue -> learned -> unlearned */
export function cycleChampionLearningState(championId: string): ChampionLearningState {
  const current = getChampionLearningState(championId)
  const next: ChampionLearningState =
    current === 'unlearned' ? 'intrigue' : current === 'intrigue' ? 'learned' : 'unlearned'
  setChampionLearningState(championId, next)
  return next
}

/* Legacy API for backward compatibility - maps to learned state only */
export function getLearnedChampions(): Set<string> {
  const map = readStateMap()
  migrateLegacyIfNeeded(map)
  return new Set(Object.entries(map).filter(([, v]) => v === 'learned').map(([id]) => id))
}

export function setChampionLearned(championId: string, learned: boolean): void {
  if (learned) {
    setChampionLearningState(championId, 'learned')
  } else {
    setChampionLearningState(championId, 'unlearned')
  }
}

export function isChampionLearned(championId: string): boolean {
  return getChampionLearningState(championId) === 'learned'
}
