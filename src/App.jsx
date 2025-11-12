import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Budgeting from './pages/Budgeting'
import Savings from './pages/Savings'
import Investing from './pages/Investing'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/budgeting" element={<Budgeting />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/investing" element={<Investing />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quiz" element={<Quiz />} />
            </Routes>
          </Layout>
        </Router>
      </GameProvider>
    </ThemeProvider>
  )
}

export default App

