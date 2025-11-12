import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Trophy, CheckCircle, Clock, Star, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const Challenges = () => {
  const { gameState, completeChallenge, unlockAchievement } = useGame()
  const [selectedTab, setSelectedTab] = useState('daily')

  const dailyChallenges = [
    {
      id: 'daily_budget',
      title: 'Track Your Expenses',
      description: 'Add at least one expense entry today',
      xp: 25,
      icon: '📊',
      completed: gameState.budgetEntries.some(e => {
        const today = new Date().toDateString()
        return new Date(e.date).toDateString() === today
      })
    },
    {
      id: 'daily_savings',
      title: 'Update Savings Goal',
      description: 'Add progress to any savings goal',
      xp: 30,
      icon: '💰',
      completed: false
    },
    {
      id: 'daily_learn',
      title: 'Learn About Investing',
      description: 'Calculate a SIP investment',
      xp: 40,
      icon: '📈',
      completed: gameState.investments.length > 0
    }
  ]

  const weeklyChallenges = [
    {
      id: 'week_budget',
      title: 'Budget Master',
      description: 'Track expenses for 7 consecutive days',
      xp: 150,
      icon: '🏆',
      completed: gameState.achievements.includes('budget_master')
    },
    {
      id: 'week_savings',
      title: 'Savings Streak',
      description: 'Create 3 new savings goals this week',
      xp: 200,
      icon: '🎯',
      completed: gameState.savingsGoals.length >= 3
    },
    {
      id: 'week_invest',
      title: 'Investment Explorer',
      description: 'Calculate 5 different SIP scenarios',
      xp: 250,
      icon: '💎',
      completed: gameState.investments.length >= 5
    }
  ]

  const specialChallenges = [
    {
      id: 'perfect_quiz',
      title: 'Perfect Score',
      description: 'Score 100% on the financial quiz',
      xp: 100,
      icon: '⭐',
      completed: gameState.achievements.includes('perfect_score')
    },
    {
      id: 'all_modules',
      title: 'Complete All Modules',
      description: 'Complete all learning modules',
      xp: 300,
      icon: '🎓',
      completed: gameState.achievements.includes('smart_spender')
    },
    {
      id: 'level_10',
      title: 'Reach Level 10',
      description: 'Become a Money Master',
      xp: 500,
      icon: '👑',
      completed: gameState.level >= 10
    }
  ]

  const handleComplete = (challenge) => {
    if (!challenge.completed) {
      completeChallenge(challenge.id)
      if (challenge.id === 'perfect_quiz') {
        unlockAchievement('perfect_score')
      }
    }
  }

  const challenges = selectedTab === 'daily' ? dailyChallenges : 
                    selectedTab === 'weekly' ? weeklyChallenges : 
                    specialChallenges

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete challenges to earn XP and unlock achievements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-700">
        {[
          { id: 'daily', label: 'Daily', icon: Clock },
          { id: 'weekly', label: 'Weekly', icon: Target },
          { id: 'special', label: 'Special', icon: Star }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-all ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover relative ${
              challenge.completed ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {challenge.completed && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            )}

            <div className="text-4xl mb-4">{challenge.icon}</div>
            <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {challenge.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="text-yellow-500" size={18} />
                <span className="font-semibold text-yellow-500">{challenge.xp} XP</span>
              </div>
              {challenge.completed ? (
                <span className="text-green-500 font-semibold">Completed ✓</span>
              ) : (
                <button
                  onClick={() => handleComplete(challenge)}
                  className="btn-primary text-sm"
                >
                  Complete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Your Challenge Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Daily Completed</p>
            <p className="text-2xl font-bold">
              {dailyChallenges.filter(c => c.completed).length} / {dailyChallenges.length}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Weekly Completed</p>
            <p className="text-2xl font-bold">
              {weeklyChallenges.filter(c => c.completed).length} / {weeklyChallenges.length}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Special Completed</p>
            <p className="text-2xl font-bold">
              {specialChallenges.filter(c => c.completed).length} / {specialChallenges.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Challenges

