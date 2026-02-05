import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Champion, loadChampions, assetUrl } from '../lib/champion-data'
import { isChampionLearned, setChampionLearned } from '../lib/storage'
import AbilityCard from '../components/AbilityCard'
import ExternalLinks from '../components/ExternalLinks'
import '../styles/detail.css'

export default function ChampionDetail() {
  const { championId } = useParams<{ championId: string }>()
  const [champion, setChampion] = useState<Champion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [learned, setLearned] = useState(false)

  useEffect(() => {
    loadChampions()
      .then((champions) => {
        const found = champions.find((c) => c.id === championId)
        if (found) {
          setChampion(found)
          setLearned(isChampionLearned(found.id))
        } else {
          setError(`Champion "${championId}" not found`)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [championId])

  const handleLearnedToggle = () => {
    if (!champion) return
    const newState = !learned
    setLearned(newState)
    setChampionLearned(champion.id, newState)
  }

  if (loading) {
    return (
      <div className="loading">
        <p>Loading champion...</p>
      </div>
    )
  }

  if (error || !champion) {
    return (
      <div className="error">
        <p>{error || 'Champion not found'}</p>
        <Link to="/">Back to Champions</Link>
      </div>
    )
  }

  const hasPlaystyle = champion.playstyle?.identity || champion.playstyle?.howToPlay || champion.playstyle?.powerSpikes
  const hasStrengthsWeaknesses = champion.strengths?.length > 0 || champion.weaknesses?.length > 0

  return (
    <div className="champion-detail-page">
      <header 
        className="champion-header"
        style={{ backgroundImage: `url(${assetUrl(champion.images.loading)})` }}
      >
        <div className="header-overlay">
          <div className="header-top">
            <Link to="/" className="back-link" aria-label="Back to champion list">← Back to Champions</Link>
            <button 
              className={`learned-button ${learned ? 'learned' : ''}`}
              onClick={handleLearnedToggle}
              aria-pressed={learned}
              aria-label={learned ? `${champion.name} marked as learned` : `Mark ${champion.name} as learned`}
            >
              {learned ? '✓ Learned' : 'Mark as Learned'}
            </button>
          </div>
          <div className="champion-title">
            <img 
              src={assetUrl(champion.images.icon)} 
              alt={champion.name}
              className="champion-icon-large"
            />
            <div className="title-text">
              <h1>{champion.name}</h1>
              <p className="title">{champion.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="champion-content" role="main">
        <section className="overview">
          <h2>Overview</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="label">Class</span>
              <span className="value">{champion.classes.join(', ')}</span>
            </div>
            <div className="overview-item">
              <span className="label">Range</span>
              <span className="value">{champion.rangeType}</span>
            </div>
            <div className="overview-item">
              <span className="label">Damage</span>
              <span className="value">{champion.damageType}</span>
            </div>
            <div className="overview-item">
              <span className="label">Lanes</span>
              <span className="value">{champion.lanes.join(', ')}</span>
            </div>
            <div className="overview-item">
              <span className="label">Resource</span>
              <span className="value">{champion.resource}</span>
            </div>
          </div>
        </section>

        {hasPlaystyle && (
          <section className="playstyle">
            <h2>Playstyle</h2>
            <div className="playstyle-content">
              {champion.playstyle?.identity && (
                <div className="playstyle-item">
                  <h3>Identity</h3>
                  <p>{champion.playstyle.identity}</p>
                </div>
              )}
              {champion.playstyle?.howToPlay && (
                <div className="playstyle-item">
                  <h3>How to Play</h3>
                  <p>{champion.playstyle.howToPlay}</p>
                </div>
              )}
              {champion.playstyle?.powerSpikes && (
                <div className="playstyle-item">
                  <h3>Power Spikes</h3>
                  <p>{champion.playstyle.powerSpikes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {hasStrengthsWeaknesses && (
          <section className="strengths-weaknesses">
            {champion.strengths?.length > 0 && (
              <div className="sw-column strengths">
                <h2>Strengths</h2>
                <ul>
                  {champion.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {champion.weaknesses?.length > 0 && (
              <div className="sw-column weaknesses">
                <h2>Weaknesses</h2>
                <ul>
                  {champion.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="abilities">
          <h2>Abilities</h2>
          <div className="abilities-list">
            {champion.passive && (
              <AbilityCard 
                ability={champion.passive}
                iconSrc={assetUrl(champion.images.passive)}
              />
            )}
            {champion.abilities.map((ability, index) => (
              <AbilityCard 
                key={ability.slot}
                ability={ability}
                iconSrc={assetUrl(champion.images.abilities[index])}
              />
            ))}
          </div>
        </section>

        <section className="external-links">
          <h2>Learn More</h2>
          <ExternalLinks championId={champion.id} championName={champion.name} />
        </section>
      </main>
    </div>
  )
}
