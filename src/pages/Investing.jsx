import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { TrendingUp, Calculator, DollarSign, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Investing = () => {
  const { gameState, addInvestment, unlockAchievement } = useGame()
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcData, setCalcData] = useState({
    amount: '',
    years: '',
    annualReturn: '12'
  })
  const [sipResult, setSipResult] = useState(null)

  useEffect(() => {
    fetchFunds()
  }, [])

  const fetchFunds = async () => {
    try {
      const response = await axios.get('/api/funds')
      if (response.data.success) {
        setFunds(response.data.funds)
      }
    } catch (error) {
      console.error('Error fetching funds:', error)
      // Fallback data
      setFunds([
        {
          name: "SBI Bluechip Fund",
          category: "Large Cap",
          min_sip: 500,
          return_5y: 18.5,
          return_3y: 16.2,
          return_1y: 14.8,
          expense_ratio: 0.68
        },
        {
          name: "HDFC Top 100 Fund",
          category: "Large Cap",
          min_sip: 500,
          return_5y: 17.2,
          return_3y: 15.5,
          return_1y: 13.9,
          expense_ratio: 0.72
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const calculateSIP = async () => {
    if (!calcData.amount || !calcData.years) return

    try {
      const response = await axios.post('/api/sip/calculate', {
        amount: parseFloat(calcData.amount),
        years: parseFloat(calcData.years),
        annual_return: parseFloat(calcData.annualReturn)
      })

      if (response.data.success) {
        setSipResult(response.data.result)
        addInvestment({
          amount: parseFloat(calcData.amount),
          years: parseFloat(calcData.years),
          annualReturn: parseFloat(calcData.annualReturn),
          maturityValue: response.data.result.maturity_value
        })
      }
    } catch (error) {
      console.error('Error calculating SIP:', error)
      // Fallback calculation
      const amount = parseFloat(calcData.amount)
      const years = parseFloat(calcData.years)
      const annualReturn = parseFloat(calcData.annualReturn) / 100
      const months = years * 12
      const monthlyRate = annualReturn / 12
      
      const futureValue = amount * ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate))
      const totalInvested = amount * months
      const estimatedGains = futureValue - totalInvested

      setSipResult({
        total_invested: totalInvested,
        estimated_gains: estimatedGains,
        maturity_value: futureValue,
        annual_return: parseFloat(calcData.annualReturn)
      })
    }
  }

  const totalInvested = gameState.investments.reduce((sum, inv) => sum + (inv.amount * inv.years * 12), 0)
  const totalMaturity = gameState.investments.reduce((sum, inv) => sum + (inv.maturityValue || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Investing</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Learn about SIP investments and calculate your returns
          </p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="btn-primary flex items-center space-x-2"
        >
          <Calculator size={20} />
          <span>SIP Calculator</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold mt-1">₹{totalInvested.toLocaleString()}</p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Projected Value</p>
              <p className="text-2xl font-bold mt-1 text-green-500">₹{totalMaturity.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Calculations</p>
              <p className="text-2xl font-bold mt-1">{gameState.investments.length}</p>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* SIP Calculator */}
      {showCalculator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">SIP Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Investment (₹)</label>
              <input
                type="number"
                value={calcData.amount}
                onChange={(e) => setCalcData({ ...calcData, amount: e.target.value })}
                placeholder="5000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={calcData.years}
                onChange={(e) => setCalcData({ ...calcData, years: e.target.value })}
                placeholder="10"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
              <input
                type="number"
                value={calcData.annualReturn}
                onChange={(e) => setCalcData({ ...calcData, annualReturn: e.target.value })}
                placeholder="12"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
          </div>
          <button onClick={calculateSIP} className="btn-primary w-full">
            Calculate
          </button>

          {sipResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white"
            >
              <h3 className="text-xl font-bold mb-4">Investment Projection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Total Invested</p>
                  <p className="text-2xl font-bold">₹{sipResult.total_invested.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Estimated Returns</p>
                  <p className="text-2xl font-bold">₹{Math.round(sipResult.estimated_gains).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Maturity Value</p>
                  <p className="text-2xl font-bold">₹{Math.round(sipResult.maturity_value).toLocaleString()}</p>
                </div>
              </div>

              {sipResult.monthly_breakdown && sipResult.monthly_breakdown.length > 0 && (
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sipResult.monthly_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Mutual Funds */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Mutual Funds</h2>
        {loading ? (
          <div className="text-center py-8">Loading funds...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funds.map((fund, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg card-hover"
              >
                <h3 className="font-bold text-lg mb-2">{fund.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {fund.category} • Min SIP: ₹{fund.min_sip}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">5Y Returns</span>
                    <span className="font-semibold text-green-500">{fund.return_5y || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">3Y Returns</span>
                    <span className="font-semibold">{fund.return_3y || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Expense Ratio</span>
                    <span className="font-semibold">{fund.expense_ratio}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Investing

