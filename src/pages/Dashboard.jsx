import { useGame } from '../context/GameContext'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  PiggyBank, 
  Wallet, 
  Trophy, 
  Target,
  ArrowRight,
  Award,
  Flame
} from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { gameState, getCurrentLevelData, ACHIEVEMENTS } = useGame()
  const currentLevel = getCurrentLevelData()
  
  const totalBudget = gameState.budgetEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
  const totalSavings = gameState.savingsGoals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0)
  const totalInvestments = gameState.investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const recentAchievements = gameState.achievements
    .slice(-3)
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)

  const quickActions = [
    { path: '/budgeting', icon: Wallet, label: 'Track Expense', color: 'blue' },
    { path: '/savings', icon: PiggyBank, label: 'New Goal', color: 'green' },
    { path: '/investing', icon: TrendingUp, label: 'Calculate SIP', color: 'purple' },
    { path: '/challenges', icon: Trophy, label: 'View Challenges', color: 'orange' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-blue-100">
          You're a <span className="font-bold">{currentLevel.name}</span> • Level {gameState.level}
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Flame size={20} />
            <span className="font-semibold">{gameState.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target size={20} />
            <span className="font-semibold">{gameState.xp} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Budget</p>
              <p className="text-2xl font-bold mt-1">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Wallet className="text-blue-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Savings Goals</p>
              <p className="text-2xl font-bold mt-1">₹{totalSavings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <PiggyBank className="text-green-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Investments</p>
              <p className="text-2xl font-bold mt-1">₹{totalInvestments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <TrendingUp className="text-purple-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Achievements</p>
              <p className="text-2xl font-bold mt-1">{gameState.achievements.length}/{ACHIEVEMENTS.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Award className="text-orange-500" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={action.path}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover flex flex-col items-center justify-center space-y-2 border-2 border-transparent hover:border-${action.color}-500`}
                >
                  <div className={`w-12 h-12 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900 flex items-center justify-center`}>
                    <Icon className={`text-${action.color}-500`} size={24} />
                  </div>
                  <span className="font-semibold text-center">{action.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Progress to Next Level */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Level Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {gameState.level}: {currentLevel.name}</span>
            <span>{gameState.xp} / {gameState.xp + gameState.xpToNextLevel} XP</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${(gameState.xp / (gameState.xp + gameState.xpToNextLevel)) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {gameState.xpToNextLevel} XP until next level
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

