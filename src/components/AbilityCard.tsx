import { useState } from 'react'
import { Ability } from '../lib/champion-data'

interface AbilityCardProps {
  ability: Ability
  iconSrc: string
}

export default function AbilityCard({ ability, iconSrc }: AbilityCardProps) {
  const [expanded, setExpanded] = useState(false)
  const hasDetails = ability.details && ability.details.trim() !== ''

  const detailsId = `ability-details-${ability.slot}`

  return (
    <article className={`ability-card ${expanded ? 'expanded' : ''}`} aria-label={`${ability.slot} - ${ability.name}`}>
      <img 
        src={iconSrc} 
        alt=""
        className="ability-icon"
        aria-hidden="true"
      />
      <div className="ability-info">
        <div className="ability-header">
          <span className="ability-slot" aria-label={`Ability slot ${ability.slot}`}>{ability.slot}</span>
          <span className="ability-name">{ability.name}</span>
          {hasDetails && (
            <button 
              className="ability-expand-btn"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls={detailsId}
              aria-label={expanded ? 'Hide details' : 'Show details'}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
        </div>
        <p className="ability-summary">{ability.summary}</p>
        {expanded && hasDetails && (
          <p id={detailsId} className="ability-details">{ability.details}</p>
        )}
      </div>
    </article>
  )
}
