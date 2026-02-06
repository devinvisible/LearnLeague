import { Link } from 'react-router-dom'
import { Champion, assetUrl } from '../lib/champion-data'
import { getClassColor } from '../lib/class-colors'
import { getChampionLearningState, cycleChampionLearningState, type ChampionLearningState } from '../lib/storage'
import { useState } from 'react'

interface ChampionCardProps {
  champion: Champion
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function ChampionCard({ champion }: ChampionCardProps) {
  const [learningState, setLearningState] = useState<ChampionLearningState>(() => getChampionLearningState(champion.id))

  const handleStateToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = cycleChampionLearningState(champion.id)
    setLearningState(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleStateToggle(e)
    }
  }

  const stateLabel = learningState === 'learned' ? 'learned' : learningState === 'intrigue' ? 'intrigue' : 'unlearned'

  return (
    <Link 
      to={`/champions/${champion.id}`}
      className={`champion-card ${learningState !== 'unlearned' ? learningState : ''}`}
      aria-label={`${champion.name} - ${champion.classes.join(', ')}${learningState !== 'unlearned' ? ` (${stateLabel})` : ''}`}
    >
      <div 
        className={`card-learned-indicator learned-indicator-${learningState}`}
        onClick={handleStateToggle}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={`Mark ${champion.name} as ${stateLabel}. Click to cycle state.`}
        tabIndex={0}
      >
        <span className={`learned-checkbox ${learningState}`} aria-hidden="true">
          {learningState === 'learned' && '✓'}
          {learningState === 'intrigue' && <EyeIcon />}
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
