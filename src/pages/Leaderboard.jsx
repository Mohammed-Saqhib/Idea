import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const Leaderboard = () => {
  const { gameState } = useGame()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard?limit=20')
      if (response.data.success) {
        // Add current user to leaderboard if not present
        const userEntry = {
          rank: 0,
          username: 'You',
          xp: gameState.xp,
          level: gameState.level,
          avatar: '👤',
          isCurrentUser: true
        }
        const allEntries = [...response.data.leaderboard, userEntry]
        allEntries.sort((a, b) => b.xp - a.xp)
        allEntries.forEach((entry, index) => {
          entry.rank = index + 1
          entry.avatar = entry.avatar || ['👤', '🧑‍💼', '👨‍🎓', '👩‍💻', '🧑‍🔬', '👨‍🎨', '👩‍⚕️', '🧑‍🏫', '👨‍🚀', '👩‍🎤'][index % 10]
        })
        setLeaderboard(allEntries)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Fallback to mock data
      const mockData = [
        { rank: 1, username: 'You', xp: gameState.xp, level: gameState.level, avatar: '👤', isCurrentUser: true },
        { rank: 2, username: 'Alex Chen', xp: 8500, level: 9, avatar: '🧑‍💼' },
        { rank: 3, username: 'Sam Patel', xp: 7200, level: 8, avatar: '👨‍🎓' },
        { rank: 4, username: 'Jordan Kim', xp: 6800, level: 8, avatar: '👩‍💻' },
        { rank: 5, username: 'Taylor Smith', xp: 5500, level: 7, avatar: '🧑‍🔬' },
        { rank: 6, username: 'Casey Brown', xp: 4800, level: 6, avatar: '👨‍🎨' },
        { rank: 7, username: 'Morgan Lee', xp: 4200, level: 6, avatar: '👩‍⚕️' },
        { rank: 8, username: 'Riley Davis', xp: 3800, level: 5, avatar: '🧑‍🏫' },
        { rank: 9, username: 'Quinn Wilson', xp: 3200, level: 5, avatar: '👨‍🚀' },
        { rank: 10, username: 'Avery Martinez', xp: 2800, level: 4, avatar: '👩‍🎤' }
      ]
      setLeaderboard(mockData)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-500" size={24} />
    if (rank === 2) return <Medal className="text-gray-400" size={24} />
    if (rank === 3) return <Medal className="text-orange-600" size={24} />
    return <span className="text-gray-500 font-bold">{rank}</span>
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-blue-500 to-purple-600'
  }

  const userEntry = leaderboard.find(u => u.isCurrentUser || u.username === 'You')
  const userRank = userEntry ? userEntry.rank : leaderboard.length + 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Compete with others and climb the ranks
        </p>
      </div>

      {/* User Rank Card */}
      <div className={`bg-gradient-to-r ${getRankColor(userRank)} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Your Rank</p>
            <div className="flex items-center space-x-3 mt-2">
              {getRankIcon(userRank)}
              <div>
                <h2 className="text-2xl font-bold">#{userRank}</h2>
                <p className="text-white/90">Level {gameState.level} • {gameState.xp} XP</p>
              </div>
            </div>
          </div>
          <Trophy size={48} className="opacity-80" />
        </div>
      </div>

      {/* Top 3 Podium */}
      {loading ? (
        <div className="text-center py-8">Loading leaderboard...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[2, 1, 3].map((rank) => {
            const user = leaderboard.find(u => u.rank === rank)
            if (!user) return null
          return (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rank === 1 ? 0.2 : 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center ${
                rank === 1 ? 'transform -translate-y-4' : ''
              }`}
            >
              <div className="text-4xl mb-2">{user.avatar}</div>
              <div className="flex justify-center mb-2">
                {getRankIcon(rank)}
              </div>
              <h3 className="font-bold">{user.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Level {user.level}
              </p>
              <p className="text-sm font-semibold text-blue-500 mt-1">
                {user.xp.toLocaleString()} XP
              </p>
            </motion.div>
          )
        })}
        </div>
      )}

      {/* Full Leaderboard */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold">All Rankings</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {leaderboard.map((user) => {
              const rank = user.rank
              const isCurrentUser = user.isCurrentUser || user.username === 'You'
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rank * 0.05 }}
                className={`p-4 flex items-center justify-between ${
                  isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 text-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <h3 className={`font-bold ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {user.username} {isCurrentUser && '(You)'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Level {user.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{user.xp.toLocaleString()} XP</p>
                  {rank <= 3 && (
                    <Award className={`inline-block mt-1 ${
                      rank === 1 ? 'text-yellow-500' :
                      rank === 2 ? 'text-gray-400' :
                      'text-orange-600'
                    }`} size={16} />
                  )}
                </div>
              </motion.div>
            )
          })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Trophy className="mx-auto text-yellow-500 mb-2" size={32} />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your Position</p>
          <p className="text-2xl font-bold">#{userRank}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Award className="mx-auto text-blue-500 mb-2" size={32} />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Players</p>
          <p className="text-2xl font-bold">{leaderboard.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Medal className="mx-auto text-purple-500 mb-2" size={32} />
          <p className="text-gray-500 dark:text-gray-400 text-sm">XP to Next Rank</p>
          <p className="text-2xl font-bold">
            {userRank > 1 && leaderboard.length > 0 ? 
              (leaderboard.find(u => u.rank === userRank - 1)?.xp - gameState.xp || 0).toLocaleString() : 
              'Top!'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

