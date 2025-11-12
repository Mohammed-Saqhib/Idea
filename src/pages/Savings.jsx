import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '../components/ui/Progress'

const Savings = () => {
  const { gameState, addSavingsGoal, updateSavingsGoal, unlockAchievement } = useGame()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.targetAmount) return

    addSavingsGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0),
      deadline: formData.deadline || null
    })

    setFormData({ name: '', targetAmount: '', currentAmount: '0', deadline: '' })
    setShowForm(false)
  }

  const handleUpdateProgress = (goalId) => {
    const amount = prompt('How much did you save? (Enter amount in ₹)')
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      updateSavingsGoal(goalId, parseFloat(amount))
    }
  }

  const totalGoals = gameState.savingsGoals.length
  const completedGoals = gameState.savingsGoals.filter(g => {
    const progress = (g.currentAmount || 0) / g.targetAmount
    return progress >= 1
  }).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your progress and achieve your financial dreams
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Goals</p>
              <p className="text-2xl font-bold mt-1">{totalGoals}</p>
            </div>
            <Target className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-500">{completedGoals}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Target</p>
              <p className="text-2xl font-bold mt-1">
                ₹{gameState.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New Laptop"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">Create Goal</button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameState.savingsGoals.map((goal) => {
          const progress = Math.min(((goal.currentAmount || 0) / goal.targetAmount) * 100, 100)
          const remaining = goal.targetAmount - (goal.currentAmount || 0)
          const isCompleted = progress >= 100

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover ${
                isCompleted ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <span>{goal.name}</span>
                    {isCompleted && <CheckCircle className="text-green-500" size={20} />}
                  </h3>
                  {goal.deadline && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'gradient-primary'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    ₹{(goal.currentAmount || 0).toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    ₹{remaining > 0 ? remaining.toLocaleString() : 0} remaining
                  </span>
                </div>
              </div>

              {!isCompleted && (
                <button
                  onClick={() => handleUpdateProgress(goal.id)}
                  className="mt-4 w-full btn-primary"
                >
                  Update Progress
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {gameState.savingsGoals.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg text-center">
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">No savings goals yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first savings goal to start tracking your progress!
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create Goal
          </button>
        </div>
      )}
    </div>
  )
}

export default Savings

