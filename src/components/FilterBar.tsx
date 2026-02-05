import { FilterState, CLASS_OPTIONS, RANGE_OPTIONS, DAMAGE_OPTIONS, LANE_OPTIONS } from '../lib/filters'

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

interface FilterChipGroupProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  colorClass?: string
}

function FilterChipGroup({ label, options, selected, onToggle, colorClass }: FilterChipGroupProps) {
  const groupId = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div className="filter-group" role="group" aria-labelledby={`${groupId}-label`}>
      <span id={`${groupId}-label`} className="filter-label">{label}</span>
      <div className="filter-chips" role="listbox" aria-multiselectable="true">
        {options.map((option) => (
          <button
            key={option}
            role="option"
            aria-selected={selected.includes(option)}
            className={`filter-chip ${selected.includes(option) ? 'active' : ''} ${colorClass || ''}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
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
      classes: [],
      rangeType: [],
      damageType: [],
      lanes: [],
    })
  }

  const hasActiveFilters = 
    filters.search !== '' ||
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
      </div>
    </div>
  )
}
