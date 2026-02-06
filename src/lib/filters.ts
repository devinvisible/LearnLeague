import { Champion } from './champion-data'
import type { ChampionLearningState } from './storage'

export type LearnedFilterValue = '' | 'Unlearned' | 'Intrigue' | 'Learned'

export interface FilterState {
  search: string
  learnedState: LearnedFilterValue
  classes: string[]
  rangeType: string[]
  damageType: string[]
  lanes: string[]
}

export const INITIAL_FILTERS: FilterState = {
  search: '',
  learnedState: '',
  classes: [],
  rangeType: [],
  damageType: [],
  lanes: [],
}

export const LEARNED_STATE_OPTIONS: LearnedFilterValue[] = ['Unlearned', 'Intrigue', 'Learned']

export const CLASS_OPTIONS = [
  // Controller subclasses
  'Enchanter',
  'Catcher',
  // Fighter subclasses
  'Juggernaut',
  'Diver',
  // Mage subclasses
  'Burst',
  'Battlemage',
  'Artillery',
  // Marksman
  'Marksman',
  // Slayer subclasses
  'Assassin',
  'Skirmisher',
  // Tank subclasses
  'Vanguard',
  'Warden',
  // Specialist
  'Specialist',
]

export const RANGE_OPTIONS = ['Melee', 'Ranged']

export const DAMAGE_OPTIONS = ['Physical', 'Magic', 'Mixed']

export const LANE_OPTIONS = ['Top', 'Jungle', 'Middle', 'Bottom', 'Support']

function learnedFilterToState(value: LearnedFilterValue): ChampionLearningState | null {
  if (value === '') return null
  return value.toLowerCase() as ChampionLearningState
}

export function filterChampions(
  champions: Champion[],
  filters: FilterState,
  getChampionLearningState?: (championId: string) => ChampionLearningState
): Champion[] {
  return champions.filter((champion) => {
    // Learned state filter (single-select)
    if (filters.learnedState && getChampionLearningState) {
      const state = learnedFilterToState(filters.learnedState)
      if (state !== null && getChampionLearningState(champion.id) !== state) {
        return false
      }
    }

    // Search filter (name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (!champion.name.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Class filter (AND: champion must have all selected classes)
    if (filters.classes.length > 0) {
      const hasAllClasses = filters.classes.every((cls) =>
        champion.classes.includes(cls)
      )
      if (!hasAllClasses) {
        return false
      }
    }

    // Range filter
    if (filters.rangeType.length > 0) {
      if (!filters.rangeType.includes(champion.rangeType)) {
        return false
      }
    }

    // Damage filter
    if (filters.damageType.length > 0) {
      if (!filters.damageType.includes(champion.damageType)) {
        return false
      }
    }

    // Lane filter (AND: champion must have all selected lanes)
    if (filters.lanes.length > 0) {
      const hasAllLanes = filters.lanes.every((lane) =>
        champion.lanes.includes(lane)
      )
      if (!hasAllLanes) {
        return false
      }
    }

    return true
  })
}
