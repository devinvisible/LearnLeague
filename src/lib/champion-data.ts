export interface Ability {
  slot: 'P' | 'Q' | 'W' | 'E' | 'R'
  name: string
  summary: string
  details: string
}

export interface Champion {
  id: string
  name: string
  title: string
  classes: string[]
  rangeType: 'Melee' | 'Ranged'
  damageType: 'Physical' | 'Magic' | 'Mixed'
  lanes: string[]
  resource: string
  images: {
    icon: string
    loading: string
    passive: string
    abilities: string[]
  }
  playstyle: {
    identity: string
    howToPlay: string
    powerSpikes: string
  }
  strengths: string[]
  weaknesses: string[]
  passive: Ability
  abilities: Ability[]
}

let championsCache: Champion[] | null = null

/** Resolve an asset path (e.g. /assets/...) for the current base URL (e.g. /LearnLeague). */
export function assetUrl(path: string): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '') || ''
  const p = path.startsWith('/') ? path.slice(1) : path
  return base ? `${base}/${p}` : `/${p}`
}

export async function loadChampions(): Promise<Champion[]> {
  if (championsCache) {
    return championsCache
  }

  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '') || ''
  const response = await fetch(`${base}/app-data/champions.json`)
  if (!response.ok) {
    throw new Error(`Failed to load champions data: ${response.statusText}`)
  }
  
  const data = await response.json()
  championsCache = data.champions as Champion[]
  return championsCache
}

export function getChampionById(champions: Champion[], id: string): Champion | undefined {
  return champions.find((c) => c.id.toLowerCase() === id.toLowerCase())
}
