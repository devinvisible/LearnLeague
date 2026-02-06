import { useState, useEffect, useMemo, useCallback } from 'react'
import { Champion, loadChampions } from '../lib/champion-data'
import { FilterState, INITIAL_FILTERS, filterChampions } from '../lib/filters'
import { getChampionLearningState } from '../lib/storage'
import FilterBar from '../components/FilterBar'
import ChampionCard from '../components/ChampionCard'
import '../styles/grid.css'

export default function ChampionGrid() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)

  useEffect(() => {
    loadChampions()
      .then(setChampions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getLearningState = useCallback(getChampionLearningState, [])
  const filteredChampions = useMemo(() => {
    return filterChampions(champions, filters, getLearningState)
  }, [champions, filters, getLearningState])

  if (loading) {
    return (
      <div className="loading">
        <p>Loading champions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading champions: {error}</p>
        <p>Make sure to run <code>npm run sync:ddragon</code> and <code>npm run build:app-data</code> first.</p>
      </div>
    )
  }

  return (
    <div className="champion-grid-page">
      <header className="page-header">
        <h1>LearnLeague</h1>
        <p className="subtitle">Learn League of Legends Champions</p>
      </header>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <div className="results-info" aria-live="polite" aria-atomic="true">
        <span>
          Showing {filteredChampions.length} of {champions.length} champions
        </span>
      </div>

      <main id="main-content" className="champion-grid" role="main" aria-label="Champion grid">
        {filteredChampions.map((champion) => (
          <ChampionCard key={champion.id} champion={champion} />
        ))}
      </main>

      {filteredChampions.length === 0 && (
        <div className="no-results">
          <p>No champions match your filters.</p>
          <p>Try adjusting your search or clearing some filters.</p>
        </div>
      )}
    </div>
  )
}
