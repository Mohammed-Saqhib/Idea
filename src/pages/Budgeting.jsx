import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Budgeting = () => {
  const { gameState, addBudgetEntry, unlockAchievement } = useGame()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    description: '',
    type: 'expense'
  })

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.description) return

    addBudgetEntry({
      ...formData,
      amount: parseFloat(formData.amount)
    })

    // Check for achievement
    const entriesThisWeek = gameState.budgetEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    }).length

    if (entriesThisWeek >= 7) {
      unlockAchievement('budget_master')
    }

    setFormData({ category: 'Food', amount: '', description: '', type: 'expense' })
    setShowForm(false)
  }

  const expenses = gameState.budgetEntries.filter(e => e.type === 'expense')
  const income = gameState.budgetEntries.filter(e => e.type === 'income')
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = income.reduce((sum, e) => sum + e.amount, 0)
  const balance = totalIncome - totalExpenses

  // Category breakdown
  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  })).filter(item => item.value > 0)

  // Monthly trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const trendData = last7Days.map(date => {
    const dayExpenses = expenses.filter(e => e.date?.startsWith(date))
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold mt-1 text-green-500">₹{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold mt-1 text-red-500">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
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
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">Add Entry</button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Expense Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No expenses yet. Add your first entry!
            </div>
          )}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
        <div className="space-y-2">
          {gameState.budgetEntries.slice(-10).reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700"
            >
              <div className="flex-1">
                <div className="font-semibold">{entry.description}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.category} • {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <div className={`font-bold ${entry.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {gameState.budgetEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No entries yet. Start tracking your budget!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Budgeting

