# 🎮 FinLearn Pro - Gamified Financial Literacy Platform for Gen Z

🌐 **Live Demo**: [https://mohammed-saqhib.github.io/Idea/](https://mohammed-saqhib.github.io/Idea/)

A comprehensive, engaging mobile-first platform that teaches Gen Z users about budgeting, saving, and investing through gamification, challenges, and rewards.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab.svg)

## ✨ Features

### 🎯 Core Features
- **📊 Budget Tracker**: Track income and expenses with visual charts and category breakdowns
- **💰 Savings Goals**: Set and track savings goals with progress visualization
- **📈 SIP Calculator**: Calculate Systematic Investment Plan returns with real-time mutual fund data
- **🧠 Financial Quiz**: Interactive quiz with 10+ questions covering financial literacy topics
- **🏆 Challenges System**: Daily, weekly, and special challenges to earn XP and rewards
- **📊 Leaderboard**: Compete with others and climb the ranks
- **🎖️ Achievements**: Unlock 11+ achievements as you progress
- **🔥 Streak System**: Maintain daily activity streaks for bonus rewards

### 🎮 Gamification
- **10 Progressive Levels**: From "Finance Newbie" to "Money Master"
- **XP System**: Earn experience points for every action
- **Badges & Achievements**: Unlock achievements for milestones
- **Daily Streaks**: Maintain consecutive day streaks
- **Rewards**: Earn points, badges, and unlock new content

### 📱 Design & UX
- **Mobile-First**: Fully responsive design optimized for mobile devices
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Smooth Animations**: 60fps animations using Framer Motion
- **Modern UI**: Clean, modern interface with glassmorphism effects
- **Accessibility**: Keyboard navigation and screen reader support

### 🔌 Real-Time Data
- **Yahoo Finance Integration**: Real-time stock and mutual fund data
- **Market Trends**: Live market indices (NIFTY50, SENSEX, NASDAQ, S&P500)
- **SIP Calculations**: Accurate SIP return calculations with historical data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "IDEA copy 2 Cursor"
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. **Start the Backend Server**
```bash
# In one terminal
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

5. **Start the Frontend Development Server**
```bash
# In another terminal (from project root)
npm run dev
```

The frontend will run on `http://localhost:3000`

### Using the Startup Script (Recommended)

We've included a convenient startup script:

```bash
# Make it executable (Mac/Linux)
chmod +x start.sh

# Run it
./start.sh
```

This will start both the backend and frontend servers automatically.

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py              # Flask backend server
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Layout.jsx    # Main layout with navigation
│   │   └── ui/           # UI components
│   ├── context/          # React Context providers
│   │   ├── GameContext.jsx  # Gamification state
│   │   └── ThemeContext.jsx # Theme management
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Budgeting.jsx
│   │   ├── Savings.jsx
│   │   ├── Investing.jsx
│   │   ├── Quiz.jsx
│   │   ├── Challenges.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Profile.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

## 🎯 Usage Guide

### For Students/Users

1. **Start Learning**: Navigate to the Quiz section to test your financial knowledge
2. **Track Budget**: Use the Budget Tracker to log your income and expenses
3. **Set Goals**: Create savings goals in the Savings section
4. **Calculate SIP**: Use the SIP Calculator to plan your investments
5. **Complete Challenges**: Check the Challenges page for daily and weekly tasks
6. **Compete**: View the Leaderboard to see your ranking
7. **Track Progress**: Visit your Profile to see achievements and stats

### For Developers

#### Backend API Endpoints

- `GET /api/health` - Health check
- `GET /api/funds` - Get mutual fund data
- `POST /api/sip/calculate` - Calculate SIP returns
- `GET /api/market/trends` - Get market trends
- `GET /api/stocks/popular` - Get popular stocks
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges/<id>/complete` - Complete a challenge
- `GET /api/leaderboard` - Get leaderboard
- `POST /api/budget/calculate` - Calculate budget breakdown
- `POST /api/savings/calculate` - Calculate savings timeline

#### Frontend State Management

The app uses React Context for state management:
- `GameContext`: Manages gamification state (XP, levels, achievements, etc.)
- `ThemeContext`: Manages dark/light theme

Data is persisted in `localStorage` for offline functionality.

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Flask** - Web framework
- **yfinance** - Yahoo Finance API wrapper
- **Pandas** - Data manipulation
- **Flask-CORS** - CORS handling

## 🎨 Customization

### Adding New Challenges

Edit `backend/app.py` and add to the `CHALLENGES` array:

```python
{
    "id": "new_challenge",
    "title": "New Challenge",
    "description": "Complete this challenge",
    "xp_reward": 100,
    "type": "custom",
    "difficulty": "medium"
}
```

### Adding New Achievements

Edit `src/context/GameContext.jsx` and add to the `ACHIEVEMENTS` array:

```javascript
{
  id: 'new_achievement',
  name: 'New Achievement',
  description: 'Description here',
  xp: 50,
  icon: '🎯'
}
```

### Customizing Theme

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## 📊 Gamification System

### Levels
1. Finance Newbie (0 XP)
2. Money Explorer (100 XP)
3. Budget Starter (250 XP)
4. Smart Saver (500 XP)
5. Investment Rookie (1000 XP)
6. Portfolio Builder (2000 XP)
7. Wealth Grower (3500 XP)
8. Finance Pro (5000 XP)
9. Money Expert (7500 XP)
10. Money Master (10000 XP)

### Achievements
- First Steps - Complete your first quiz
- Perfect Score - Score 100% on a quiz
- Savings Guru - Create 5 savings goals
- Early Investor - Calculate 3 SIP investments
- Budget Master - Track expenses for 7 days
- Week Warrior - Maintain a 7-day streak
- Smart Spender - Complete all modules
- Challenge Champion - Complete 10 challenges
- Goal Crusher - Achieve 3 savings goals
- Speed Demon - Complete quiz in <30s
- Finance Pro - Reach level 10

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

**Python dependencies not installing:**
```bash
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### Frontend Issues

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
Edit `vite.config.js` and change the port:
```javascript
server: {
  port: 3001, // Change to available port
}
```

## 📝 API Documentation

### SIP Calculation
```javascript
POST /api/sip/calculate
Body: {
  "amount": 5000,
  "years": 10,
  "annual_return": 12
}
```

### Budget Calculation (50-30-20 Rule)
```javascript
POST /api/budget/calculate
Body: {
  "income": 50000
}
```

### Savings Goal Timeline
```javascript
POST /api/savings/calculate
Body: {
  "goal_amount": 100000,
  "monthly_savings": 5000,
  "interest_rate": 6
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
1. Create a `Procfile`:
```
web: python backend/app.py
```
2. Set environment variables
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Yahoo Finance for providing financial data APIs
- React and Flask communities for excellent documentation
- All the open-source libraries that made this project possible

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for Gen Z financial literacy**
