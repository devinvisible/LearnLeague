const LEARNED_KEY = 'learnleague_learned_champions'

export function getLearnedChampions(): Set<string> {
  try {
    const stored = localStorage.getItem(LEARNED_KEY)
    if (stored) {
      return new Set(JSON.parse(stored))
    }
  } catch {
    // Ignore parse errors
  }
  return new Set()
}

export function setChampionLearned(championId: string, learned: boolean): void {
  const current = getLearnedChampions()
  if (learned) {
    current.add(championId)
  } else {
    current.delete(championId)
  }
  localStorage.setItem(LEARNED_KEY, JSON.stringify([...current]))
}

export function isChampionLearned(championId: string): boolean {
  return getLearnedChampions().has(championId)
}
