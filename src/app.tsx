import { Route, Routes } from 'react-router-dom'
import CowSoccerGame from './features/cow-soccer/cow-soccer-game.tsx'
import SettingsScreen from './features/settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CowSoccerGame />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  )
}

export default App
