import { Routes, Route } from 'react-router-dom'
import ChampionGrid from './routes/ChampionGrid'
import ChampionDetail from './routes/ChampionDetail'

function App() {
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Routes>
        <Route path="/" element={<ChampionGrid />} />
        <Route path="/champions/:championId" element={<ChampionDetail />} />
      </Routes>
    </div>
  )
}

export default App
