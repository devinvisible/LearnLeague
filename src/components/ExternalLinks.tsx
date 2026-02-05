interface ExternalLinksProps {
  championId: string
  championName: string
}

interface LinkConfig {
  name: string
  url: string
  color: string
}

function getExternalLinks(championId: string, championName: string): LinkConfig[] {
  // Use lowercase ID for most sites, but name for wiki
  const id = championId.toLowerCase()
  const name = championName.replace(/'/g, '%27').replace(/ /g, '_')
  
  return [
    {
      name: 'Wiki',
      url: `https://wiki.leagueoflegends.com/en-us/${name}`,
      color: '#c89b3c',
    },
    {
      name: 'U.GG',
      url: `https://u.gg/lol/champions/${id}/build`,
      color: '#3b82f6',
    },
    {
      name: 'OP.GG',
      url: `https://op.gg/champions/${id}`,
      color: '#1e90ff',
    },
    {
      name: 'DeepLoL',
      url: `https://www.deeplol.gg/champions/${id}`,
      color: '#a855f7',
    },
    {
      name: 'Mobalytics',
      url: `https://mobalytics.gg/lol/champions/${id}/build`,
      color: '#14b8a6',
    },
  ]
}

export default function ExternalLinks({ championId, championName }: ExternalLinksProps) {
  const links = getExternalLinks(championId, championName)

  return (
    <div className="external-links-container">
      <div className="links-grid">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
            style={{ '--link-color': link.color } as React.CSSProperties}
          >
            <span className="link-name">{link.name}</span>
            <span className="link-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
