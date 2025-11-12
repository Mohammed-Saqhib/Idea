import { createContext, useContext, useState, useEffect } from 'react'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

const INITIAL_STATE = {
  points: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  lastActiveDate: null,
  achievements: [],
  badges: [],
  completedChallenges: [],
  budgetEntries: [],
  savingsGoals: [],
  investments: []
}

const LEVELS = [
  { level: 1, name: "Finance Newbie", xpRequired: 0 },
  { level: 2, name: "Money Explorer", xpRequired: 100 },
  { level: 3, name: "Budget Starter", xpRequired: 250 },
  { level: 4, name: "Smart Saver", xpRequired: 500 },
  { level: 5, name: "Investment Rookie", xpRequired: 1000 },
  { level: 6, name: "Portfolio Builder", xpRequired: 2000 },
  { level: 7, name: "Wealth Grower", xpRequired: 3500 },
  { level: 8, name: "Finance Pro", xpRequired: 5000 },
  { level: 9, name: "Money Expert", xpRequired: 7500 },
  { level: 10, name: "Money Master", xpRequired: 10000 }
]

const ACHIEVEMENTS = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first quiz', xp: 50, icon: '🎯' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on a quiz', xp: 100, icon: '⭐' },
  { id: 'savings_guru', name: 'Savings Guru', description: 'Create 5 savings goals', xp: 150, icon: '💰' },
  { id: 'early_investor', name: 'Early Investor', description: 'Calculate 3 SIP investments', xp: 200, icon: '📈' },
  { id: 'budget_master', name: 'Budget Master', description: 'Track expenses for 7 days', xp: 150, icon: '📊' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', xp: 200, icon: '🔥' },
  { id: 'smart_spender', name: 'Smart Spender', description: 'Complete all modules', xp: 300, icon: '🎓' },
  { id: 'challenge_champion', name: 'Challenge Champion', description: 'Complete 10 challenges', xp: 250, icon: '🏆' },
  { id: 'goal_crusher', name: 'Goal Crusher', description: 'Achieve 3 savings goals', xp: 200, icon: '🎯' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete quiz in <30s', xp: 25, icon: '⚡' },
  { id: 'finance_pro', name: 'Finance Pro', description: 'Reach level 10', xp: 500, icon: '💎' }
]

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('finlearn_game_state')
    return saved ? JSON.parse(saved) : INITIAL_STATE
  })

  useEffect(() => {
    localStorage.setItem('finlearn_game_state', JSON.stringify(gameState))
  }, [gameState])

  useEffect(() => {
    // Update streak
    const today = new Date().toDateString()
    const lastActive = gameState.lastActiveDate ? new Date(gameState.lastActiveDate).toDateString() : null
    
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActive === yesterday.toDateString()) {
        // Consecutive day
        setGameState(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastActiveDate: new Date().toISOString()
        }))
      } else if (!lastActive) {
        // First time
        setGameState(prev => ({
          ...prev,
          streak: 1,
          lastActiveDate: new Date().toISOString()
        }))
      } else {
        // Streak broken
        setGameState(prev => ({
          ...prev,
          streak: 1,
          lastActiveDate: new Date().toISOString()
        }))
      }
    }
  }, [])

  const addXP = (amount) => {
    setGameState(prev => {
      const newXP = prev.xp + amount
      const currentLevelData = LEVELS.find(l => l.level === prev.level) || LEVELS[0]
      const nextLevelData = LEVELS.find(l => l.level === prev.level + 1)
      
      let newLevel = prev.level
      let xpToNext = prev.xpToNextLevel
      
      if (nextLevelData && newXP >= nextLevelData.xpRequired) {
        newLevel = nextLevelData.level
        const nextNextLevel = LEVELS.find(l => l.level === newLevel + 1)
        xpToNext = nextNextLevel ? nextNextLevel.xpRequired - newXP : 0
      } else if (nextLevelData) {
        xpToNext = nextLevelData.xpRequired - newXP
      }
      
      const levelUp = newLevel > prev.level
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: xpToNext,
        points: prev.points + amount
      }
    })
  }

  const addPoints = (amount) => {
    addXP(amount)
  }

  const unlockAchievement = (achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement || gameState.achievements.includes(achievementId)) {
      return false
    }
    
    setGameState(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievementId],
      badges: [...prev.badges, achievement]
    }))
    
    addXP(achievement.xp)
    return true
  }

  const completeChallenge = (challengeId) => {
    if (gameState.completedChallenges.includes(challengeId)) {
      return false
    }
    
    setGameState(prev => ({
      ...prev,
      completedChallenges: [...prev.completedChallenges, challengeId]
    }))
    
    addXP(50)
    return true
  }

  const addBudgetEntry = (entry) => {
    setGameState(prev => ({
      ...prev,
      budgetEntries: [...prev.budgetEntries, { ...entry, id: Date.now(), date: new Date().toISOString() }]
    }))
    addXP(10)
  }

  const addSavingsGoal = (goal) => {
    setGameState(prev => {
      const newGoals = [...prev.savingsGoals, { ...goal, id: Date.now(), progress: 0 }]
      if (newGoals.length >= 5) {
        unlockAchievement('savings_guru')
      }
      return {
        ...prev,
        savingsGoals: newGoals
      }
    })
    addXP(25)
  }

  const addInvestment = (investment) => {
    setGameState(prev => {
      const newInvestments = [...prev.investments, { ...investment, id: Date.now() }]
      if (newInvestments.length >= 3) {
        unlockAchievement('early_investor')
      }
      return {
        ...prev,
        investments: newInvestments
      }
    })
    addXP(30)
  }
  
  const updateSavingsGoal = (goalId, newAmount) => {
    setGameState(prev => {
      const updatedGoals = prev.savingsGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: (goal.currentAmount || 0) + newAmount }
          : goal
      )
      
      // Check if goal is completed
      const updatedGoal = updatedGoals.find(g => g.id === goalId)
      if (updatedGoal) {
        const finalAmount = updatedGoal.currentAmount
        if (finalAmount >= updatedGoal.targetAmount) {
          const completedGoals = updatedGoals.filter(g => {
            const progress = (g.currentAmount || 0) / g.targetAmount
            return progress >= 1
          }).length
          if (completedGoals >= 3) {
            unlockAchievement('goal_crusher')
          }
        }
      }
      
      return {
        ...prev,
        savingsGoals: updatedGoals
      }
    })
    
    addXP(10)
  }

  const getCurrentLevelData = () => {
    return LEVELS.find(l => l.level === gameState.level) || LEVELS[0]
  }

  const getNextLevelData = () => {
    return LEVELS.find(l => l.level === gameState.level + 1)
  }

  const getAchievement = (id) => {
    return ACHIEVEMENTS.find(a => a.id === id)
  }

  const value = {
    gameState,
    addXP,
    addPoints,
    unlockAchievement,
    completeChallenge,
    addBudgetEntry,
    addSavingsGoal,
    updateSavingsGoal,
    addInvestment,
    getCurrentLevelData,
    getNextLevelData,
    getAchievement,
    LEVELS,
    ACHIEVEMENTS
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

