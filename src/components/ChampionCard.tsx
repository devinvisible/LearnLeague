import { Link } from 'react-router-dom'
import { Champion, assetUrl } from '../lib/champion-data'
import { getClassColor } from '../lib/class-colors'
import { isChampionLearned, setChampionLearned } from '../lib/storage'
import { useState } from 'react'

interface ChampionCardProps {
  champion: Champion
}

export default function ChampionCard({ champion }: ChampionCardProps) {
  const [learned, setLearned] = useState(() => isChampionLearned(champion.id))

  const handleLearnedToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !learned
    setLearned(newState)
    setChampionLearned(champion.id, newState)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLearnedToggle(e)
    }
  }

  return (
    <Link 
      to={`/champions/${champion.id}`}
      className={`champion-card ${learned ? 'learned' : ''}`}
      aria-label={`${champion.name} - ${champion.classes.join(', ')}${learned ? ' (learned)' : ''}`}
    >
      <div 
        className="card-learned-indicator" 
        onClick={handleLearnedToggle}
        onKeyDown={handleKeyDown}
        role="checkbox"
        aria-checked={learned}
        aria-label={`Mark ${champion.name} as ${learned ? 'not learned' : 'learned'}`}
        tabIndex={0}
      >
        <span className={`learned-checkbox ${learned ? 'checked' : ''}`} aria-hidden="true">
          {learned ? '✓' : ''}
        </span>
      </div>
      
      <img 
        src={assetUrl(champion.images.icon)} 
        alt={champion.name}
        className="champion-icon"
        loading="lazy"
      />
      
      <div className="champion-info">
        <span className="champion-name">{champion.name}</span>
        <div className="champion-classes">
          {champion.classes.map((cls) => (
            <span key={cls} className={`class-badge ${getClassColor(cls)}`}>
              {cls}
            </span>
          ))}
        </div>
        <div className="champion-lanes">
          {champion.lanes.map((lane) => (
            <span key={lane} className="lane-badge">
              {lane}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
