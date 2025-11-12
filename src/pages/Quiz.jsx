import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const QUIZ_DATA = [
  {
    question: "What percentage of your income should ideally go to savings?",
    options: ["5-10%", "10-20%", "20-30%", "30-40%"],
    correct: 1,
    explanation: "Financial experts recommend saving 10-20% of your income for long-term financial security."
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest on principal only",
      "Interest on principal + accumulated interest",
      "Fixed interest rate",
      "No interest"
    ],
    correct: 1,
    explanation: "Compound interest is interest calculated on the initial principal and accumulated interest from previous periods."
  },
  {
    question: "What is an emergency fund?",
    options: [
      "Money for shopping",
      "Money saved for unexpected expenses",
      "Investment fund",
      "Retirement savings"
    ],
    correct: 1,
    explanation: "An emergency fund is money set aside to cover unexpected expenses or financial emergencies."
  },
  {
    question: "Which is considered good debt?",
    options: [
      "Credit card debt",
      "Student loan for education",
      "Personal loan for vacation",
      "High-interest loan"
    ],
    correct: 1,
    explanation: "Student loans for education are considered good debt as they invest in your future earning potential."
  },
  {
    question: "What does SIP stand for?",
    options: [
      "Standard Investment Plan",
      "Systematic Investment Plan",
      "Simple Interest Plan",
      "Stock Investment Program"
    ],
    correct: 1,
    explanation: "SIP stands for Systematic Investment Plan, a method of investing in mutual funds regularly."
  },
  {
    question: "What is budgeting?",
    options: [
      "Spending all your money",
      "Planning and tracking income/expenses",
      "Borrowing money",
      "Avoiding expenses"
    ],
    correct: 1,
    explanation: "Budgeting is the process of creating a plan to spend your money and tracking your income and expenses."
  },
  {
    question: "What is the 50-30-20 budgeting rule?",
    options: [
      "50% needs, 30% wants, 20% savings",
      "50% savings, 30% needs, 20% wants",
      "50% wants, 30% savings, 20% needs",
      "Equal distribution"
    ],
    correct: 0,
    explanation: "The 50-30-20 rule allocates 50% to needs, 30% to wants, and 20% to savings and debt repayment."
  },
  {
    question: "What is inflation?",
    options: [
      "Decrease in prices",
      "Increase in general price level",
      "Stable prices",
      "Currency devaluation"
    ],
    correct: 1,
    explanation: "Inflation is the rate at which the general level of prices for goods and services rises over time."
  },
  {
    question: "Which is a low-risk investment?",
    options: [
      "Cryptocurrency",
      "Fixed deposits",
      "Penny stocks",
      "Options trading"
    ],
    correct: 1,
    explanation: "Fixed deposits are considered low-risk investments as they offer guaranteed returns and capital protection."
  },
  {
    question: "What is the purpose of diversification?",
    options: [
      "Put all money in one investment",
      "Spread investments to reduce risk",
      "Only invest in stocks",
      "Avoid investing"
    ],
    correct: 1,
    explanation: "Diversification spreads investments across different assets to reduce overall risk in a portfolio."
  }
]

const Quiz = () => {
  const { addXP, unlockAchievement } = useGame()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime, setStartTime] = useState(null)

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
    unlockAchievement('first_steps')
  }

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    
    const isCorrect = index === QUIZ_DATA[currentQuestion].correct
    const newScore = isCorrect ? score + 1 : score
    setScore(newScore)
    
    setAnswers([...answers, { question: currentQuestion, selected: index, correct: isCorrect }])
    
    setTimeout(() => {
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        finishQuiz(newScore)
      }
    }, 2000)
  }

  const finishQuiz = (finalScore) => {
    setQuizCompleted(true)
    const percentage = (finalScore / QUIZ_DATA.length) * 100
    const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 0
    
    // Award XP
    const baseXP = finalScore * 10
    addXP(baseXP)
    
    // Check achievements
    if (percentage === 100) {
      unlockAchievement('perfect_score')
      addXP(50) // Bonus for perfect score
    }
    
    if (timeTaken < 30) {
      unlockAchievement('speed_demon')
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizStarted(false)
    setQuizCompleted(false)
    setStartTime(null)
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <Trophy className="mx-auto mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Financial Literacy Quiz</h1>
          <p className="text-blue-100 mb-6">
            Test your knowledge with {QUIZ_DATA.length} questions about budgeting, saving, and investing.
            Earn XP for each correct answer!
          </p>
          <button onClick={startQuiz} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all">
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = (score / QUIZ_DATA.length) * 100
    const passed = percentage >= 60
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center"
        >
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-bold mb-4">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h1>
          <div className="text-5xl font-bold mb-4 text-blue-500">
            {score} / {QUIZ_DATA.length}
          </div>
          <div className="text-2xl font-semibold mb-6">
            {percentage.toFixed(0)}%
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {passed
              ? "Great job! You've demonstrated strong financial knowledge. Check your email for a reward voucher!"
              : "Don't worry! Review the questions and try again to improve your score."}
          </p>
          <div className="flex space-x-4 justify-center">
            <button onClick={resetQuiz} className="btn-primary">
              Retake Quiz
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const question = QUIZ_DATA[currentQuestion]
  const progress = ((currentQuestion + 1) / QUIZ_DATA.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestion + 1} of {QUIZ_DATA.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correct
            const showFeedback = selectedAnswer !== null
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showFeedback
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-slate-700'
                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showFeedback && (
                    <>
                      {isCorrect && <CheckCircle className="text-green-500" size={20} />}
                      {isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Quiz

