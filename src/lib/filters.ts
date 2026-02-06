import { Champion } from './champion-data'

export interface FilterState {
  search: string
  classes: string[]
  rangeType: string[]
  damageType: string[]
  lanes: string[]
}

export const INITIAL_FILTERS: FilterState = {
  search: '',
  classes: [],
  rangeType: [],
  damageType: [],
  lanes: [],
}

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

export function filterChampions(
  champions: Champion[],
  filters: FilterState
): Champion[] {
  return champions.filter((champion) => {
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
