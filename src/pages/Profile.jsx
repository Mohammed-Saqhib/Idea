import { useGame } from '../context/GameContext'
import { Award, Trophy, Target, TrendingUp, Calendar, Flame } from 'lucide-react'
import { motion } from 'framer-motion'

const Profile = () => {
  const { gameState, getCurrentLevelData, ACHIEVEMENTS, LEVELS } = useGame()
  const currentLevel = getCurrentLevelData()
  const nextLevel = LEVELS.find(l => l.level === gameState.level + 1)

  const unlockedAchievements = gameState.achievements
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)

  const lockedAchievements = ACHIEVEMENTS.filter(
    a => !gameState.achievements.includes(a.id)
  )

  const stats = [
    {
      label: 'Total XP',
      value: gameState.xp.toLocaleString(),
      icon: Target,
      color: 'blue'
    },
    {
      label: 'Current Level',
      value: gameState.level,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: 'Day Streak',
      value: gameState.streak,
      icon: Flame,
      color: 'orange'
    },
    {
      label: 'Achievements',
      value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`,
      icon: Award,
      color: 'green'
    }
  ]

  const activities = [
    { type: 'budget', count: gameState.budgetEntries.length, label: 'Budget Entries' },
    { type: 'savings', count: gameState.savingsGoals.length, label: 'Savings Goals' },
    { type: 'investments', count: gameState.investments.length, label: 'SIP Calculations' },
    { type: 'challenges', count: gameState.completedChallenges.length, label: 'Challenges Completed' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-blue-100 text-lg">{currentLevel.name}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Flame size={18} />
                <span>{gameState.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={18} />
                <span>{gameState.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900 flex items-center justify-center`}>
                  <Icon className={`text-${stat.color}-500`} size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Level Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Level Progress</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Level {gameState.level}: {currentLevel.name}</p>
              {nextLevel && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next: {nextLevel.name} ({nextLevel.xpRequired} XP required)
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">{gameState.xp} / {nextLevel ? nextLevel.xpRequired : gameState.xp} XP</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nextLevel ? (nextLevel.xpRequired - gameState.xp) : 0} XP to next level
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{
                width: nextLevel
                  ? `${(gameState.xp / nextLevel.xpRequired) * 100}%`
                  : '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Activity Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activities.map((activity) => (
            <div key={activity.type} className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <p className="text-3xl font-bold text-blue-500">{activity.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{achievement.name}</h3>
                  <p className="text-white/90 text-sm">{achievement.description}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Trophy size={16} className="text-white" />
                    <span className="text-white text-sm font-semibold">{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Locked Achievements */}
          {lockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (unlockedAchievements.length + index) * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg opacity-60"
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl grayscale">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold">{achievement.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{achievement.description}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Trophy size={16} className="text-gray-400" />
                    <span className="text-gray-400 text-sm font-semibold">{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile

