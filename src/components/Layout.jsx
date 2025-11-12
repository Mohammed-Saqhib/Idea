import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useGame } from '../context/GameContext'
import { 
  Home, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  Trophy, 
  Users, 
  User,
  Moon,
  Sun,
  Menu,
  X,
  HelpCircle
} from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { gameState, getCurrentLevelData } = useGame()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const currentLevel = getCurrentLevelData()
  const progress = (gameState.xp / (gameState.xpToNextLevel + gameState.xp)) * 100

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/budgeting', icon: Wallet, label: 'Budget' },
    { path: '/savings', icon: PiggyBank, label: 'Savings' },
    { path: '/investing', icon: TrendingUp, label: 'Invest' },
    { path: '/quiz', icon: HelpCircle, label: 'Quiz' },
    { path: '/challenges', icon: Trophy, label: 'Challenges' },
    { path: '/leaderboard', icon: Users, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  F
                </div>
                <span className="font-bold text-xl hidden sm:block">FinLearn Pro</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
                  <div className="font-bold text-lg">{gameState.level}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
                  <div className="font-bold text-lg">{gameState.xp}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
                  <div className="font-bold text-lg flex items-center justify-center">
                    🔥 {gameState.streak}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-slate-700 mb-2">
            <div
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-b border-gray-200 dark:border-slate-700">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <aside className="w-64 min-h-screen glass border-r border-gray-200 dark:border-slate-700 sticky top-0">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Level Card */}
          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="text-sm opacity-90">Current Level</div>
            <div className="text-2xl font-bold mt-1">{currentLevel.name}</div>
            <div className="mt-2 text-sm">
              {gameState.xp} / {gameState.xp + gameState.xpToNextLevel} XP
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <main className="p-4">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200 dark:border-slate-700">
          <div className="flex justify-around items-center h-16">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 h-full ${
                    isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="h-16" /> {/* Spacer for bottom nav */}
      </div>
    </div>
  )
}

export default Layout

