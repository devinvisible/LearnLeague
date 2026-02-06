import { FilterState, CLASS_OPTIONS, RANGE_OPTIONS, DAMAGE_OPTIONS, LANE_OPTIONS, LEARNED_STATE_OPTIONS, type LearnedFilterValue } from '../lib/filters'
import { getClassColor } from '../lib/class-colors'

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

interface FilterChipGroupProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  /** Optional: per-option color class (e.g. for Class chips). */
  getOptionColorClass?: (option: string) => string
}

function FilterChipGroup({ label, options, selected, onToggle, getOptionColorClass }: FilterChipGroupProps) {
  const groupId = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div className="filter-group" role="group" aria-labelledby={`${groupId}-label`}>
      <span id={`${groupId}-label`} className="filter-label">{label}</span>
      <div className="filter-chips" role="listbox" aria-multiselectable="true">
        {options.map((option) => {
          const colorClass = getOptionColorClass?.(option) ?? ''
          return (
            <button
              key={option}
              role="option"
              aria-selected={selected.includes(option)}
              className={`filter-chip ${selected.includes(option) ? 'active' : ''} ${colorClass}`.trim()}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const toggleFilter = (category: keyof Omit<FilterState, 'search'>, value: string) => {
    const current = filters[category] as string[]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [category]: updated })
  }

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      learnedState: '',
      classes: [],
      rangeType: [],
      damageType: [],
      lanes: [],
    })
  }

  const setLearnedFilter = (value: LearnedFilterValue) => {
    const next = filters.learnedState === value ? '' : value
    onFilterChange({ ...filters, learnedState: next })
  }

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.learnedState !== '' ||
    filters.classes.length > 0 ||
    filters.rangeType.length > 0 ||
    filters.damageType.length > 0 ||
    filters.lanes.length > 0

  return (
    <div className="filter-bar" role="search" aria-label="Champion filters">
      <div className="filter-row search-row">
        <input
          type="search"
          placeholder="Search champions..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="search-input"
          aria-label="Search champions by name"
        />
        {hasActiveFilters && (
          <button 
            className="clear-filters" 
            onClick={clearAllFilters}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-row">
        <FilterChipGroup
          label="Class"
          options={CLASS_OPTIONS}
          selected={filters.classes}
          onToggle={(v) => toggleFilter('classes', v)}
          getOptionColorClass={getClassColor}
        />
      </div>

      <div className="filter-row compact">
        <FilterChipGroup
          label="Range"
          options={RANGE_OPTIONS}
          selected={filters.rangeType}
          onToggle={(v) => toggleFilter('rangeType', v)}
        />

        <FilterChipGroup
          label="Damage"
          options={DAMAGE_OPTIONS}
          selected={filters.damageType}
          onToggle={(v) => toggleFilter('damageType', v)}
        />

        <FilterChipGroup
          label="Lane"
          options={LANE_OPTIONS}
          selected={filters.lanes}
          onToggle={(v) => toggleFilter('lanes', v)}
        />
        
        <div className="filter-group" role="group" aria-labelledby="filter-learned-label">
          <span id="filter-learned-label" className="filter-label">Learned</span>
          <div className="filter-chips filter-chips-single" role="listbox" aria-label="Champion learning state filter">
            {LEARNED_STATE_OPTIONS.map((option) => (
              <button
                key={option}
                role="option"
                aria-selected={filters.learnedState === option}
                className={`filter-chip learned-chip learned-chip-${option.toLowerCase()} ${filters.learnedState === option ? 'active' : ''}`.trim()}
                onClick={() => setLearnedFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
