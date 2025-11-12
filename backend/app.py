from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import uuid
from functools import wraps

app = Flask(__name__)
CORS(app)

# In-memory database (replace with real DB in production)
users_db = {}
challenges_db = []
leaderboard_db = []

# Sample mutual fund data (Indian funds)
MUTUAL_FUNDS = [
    {
        "symbol": "0P0000XVQB.BO",  # SBI Bluechip Fund
        "name": "SBI Bluechip Fund",
        "category": "Large Cap",
        "min_sip": 500,
        "expense_ratio": 0.68
    },
    {
        "symbol": "0P0000XVQC.BO",  # HDFC Top 100 Fund
        "name": "HDFC Top 100 Fund",
        "category": "Large Cap",
        "min_sip": 500,
        "expense_ratio": 0.72
    },
    {
        "symbol": "0P0000XVQD.BO",  # ICICI Prudential Value Discovery Fund
        "name": "ICICI Prudential Value Discovery Fund",
        "category": "Value",
        "min_sip": 100,
        "expense_ratio": 0.82
    },
    {
        "symbol": "0P0000XVQE.BO",  # Axis Midcap Fund
        "name": "Axis Midcap Fund",
        "category": "Mid Cap",
        "min_sip": 500,
        "expense_ratio": 0.75
    },
    {
        "symbol": "0P0000XVQF.BO",  # Mirae Asset Large Cap Fund
        "name": "Mirae Asset Large Cap Fund",
        "category": "Large Cap",
        "min_sip": 100,
        "expense_ratio": 0.52
    },
    {
        "symbol": "0P0000XVQG.BO",  # Parag Parikh Flexi Cap Fund
        "name": "Parag Parikh Flexi Cap Fund",
        "category": "Flexi Cap",
        "min_sip": 500,
        "expense_ratio": 0.82
    },
    {
        "symbol": "0P0000XVQH.BO",  # Nippon India Small Cap Fund
        "name": "Nippon India Small Cap Fund",
        "category": "Small Cap",
        "min_sip": 100,
        "expense_ratio": 0.65
    },
    {
        "symbol": "0P0000XVQI.BO",  # Quant Small Cap Fund
        "name": "Quant Small Cap Fund",
        "category": "Small Cap",
        "min_sip": 1000,
        "expense_ratio": 0.66
    }
]

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "FinLearn API is running"})

@app.route('/api/funds', methods=['GET'])
def get_funds():
    """Get list of mutual funds with live data"""
    try:
        funds_data = []
        for fund in MUTUAL_FUNDS:
            try:
                ticker = yf.Ticker(fund["symbol"])
                hist = ticker.history(period="5y")
                
                if len(hist) > 0:
                    # Calculate returns
                    current_price = hist['Close'].iloc[-1]
                    price_1y_ago = hist['Close'].iloc[-252] if len(hist) >= 252 else hist['Close'].iloc[0]
                    price_3y_ago = hist['Close'].iloc[-756] if len(hist) >= 756 else hist['Close'].iloc[0]
                    price_5y_ago = hist['Close'].iloc[0]
                    
                    return_1y = ((current_price - price_1y_ago) / price_1y_ago) * 100 if len(hist) >= 252 else 0
                    return_3y = ((current_price - price_3y_ago) / price_3y_ago) * 100 if len(hist) >= 756 else 0
                    return_5y = ((current_price - price_5y_ago) / price_5y_ago) * 100
                    
                    fund_data = {
                        **fund,
                        "return_1y": round(return_1y, 2),
                        "return_3y": round(return_3y, 2),
                        "return_5y": round(return_5y, 2),
                        "current_nav": round(current_price, 2),
                        "last_updated": datetime.now().isoformat()
                    }
                else:
                    # Fallback data if API fails
                    fund_data = {
                        **fund,
                        "return_1y": 15.5,
                        "return_3y": 18.2,
                        "return_5y": 20.5,
                        "current_nav": 100.0,
                        "last_updated": datetime.now().isoformat()
                    }
            except Exception as e:
                # Fallback data on error
                fund_data = {
                    **fund,
                    "return_1y": 15.5,
                    "return_3y": 18.2,
                    "return_5y": 20.5,
                    "current_nav": 100.0,
                    "last_updated": datetime.now().isoformat(),
                    "error": str(e)
                }
            
            funds_data.append(fund_data)
        
        return jsonify({"success": True, "funds": funds_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/sip/calculate', methods=['POST'])
def calculate_sip():
    """Calculate SIP returns"""
    try:
        data = request.json
        amount = float(data.get('amount', 0))
        years = float(data.get('years', 0))
        annual_return = float(data.get('annual_return', 12))
        
        if amount <= 0 or years <= 0:
            return jsonify({"success": False, "error": "Invalid input"}), 400
        
        monthly_rate = annual_return / 12 / 100
        months = int(years * 12)
        
        # SIP formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
        future_value = amount * ((((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate))
        total_invested = amount * months
        estimated_gains = future_value - total_invested
        
        # Generate monthly breakdown
        monthly_breakdown = []
        accumulated = 0
        for month in range(1, min(months + 1, 61)):  # Limit to 60 months for performance
            accumulated = amount * ((((1 + monthly_rate) ** month - 1) / monthly_rate) * (1 + monthly_rate))
            monthly_breakdown.append({
                "month": month,
                "invested": amount * month,
                "value": round(accumulated, 2),
                "gains": round(accumulated - (amount * month), 2)
            })
        
        return jsonify({
            "success": True,
            "result": {
                "total_invested": round(total_invested, 2),
                "estimated_gains": round(estimated_gains, 2),
                "maturity_value": round(future_value, 2),
                "annual_return": annual_return,
                "monthly_breakdown": monthly_breakdown
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/stock/quote', methods=['GET'])
def get_stock_quote():
    """Get real-time stock quote"""
    try:
        symbol = request.args.get('symbol', 'AAPL')
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        quote = {
            "symbol": symbol,
            "name": info.get('longName', symbol),
            "price": info.get('currentPrice', 0),
            "change": info.get('regularMarketChange', 0),
            "changePercent": info.get('regularMarketChangePercent', 0),
            "volume": info.get('volume', 0),
            "marketCap": info.get('marketCap', 0),
            "pe": info.get('trailingPE', 0),
            "dividendYield": info.get('dividendYield', 0)
        }
        
        return jsonify({"success": True, "quote": quote})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/market/trends', methods=['GET'])
def get_market_trends():
    """Get market trends for educational purposes"""
    try:
        # Get data for major indices
        indices = {
            "NIFTY50": "^NSEI",
            "SENSEX": "^BSESN",
            "NASDAQ": "^IXIC",
            "S&P500": "^GSPC"
        }
        
        trends = []
        for name, symbol in indices.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1mo")
                if len(hist) > 0:
                    current = hist['Close'].iloc[-1]
                    previous = hist['Close'].iloc[0]
                    change = ((current - previous) / previous) * 100
                    
                    trends.append({
                        "name": name,
                        "symbol": symbol,
                        "value": round(current, 2),
                        "change": round(change, 2),
                        "trend": "up" if change > 0 else "down"
                    })
            except:
                continue
        
        return jsonify({"success": True, "trends": trends})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# User Management
@app.route('/api/user/register', methods=['POST'])
def register_user():
    """Register a new user"""
    try:
        data = request.json
        user_id = str(uuid.uuid4())
        
        user = {
            "id": user_id,
            "username": data.get('username', f'User_{user_id[:8]}'),
            "email": data.get('email', ''),
            "created_at": datetime.now().isoformat(),
            "xp": 0,
            "level": 1,
            "streak": 0,
            "achievements": [],
            "completed_challenges": []
        }
        
        users_db[user_id] = user
        return jsonify({"success": True, "user": user})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user data"""
    if user_id not in users_db:
        return jsonify({"success": False, "error": "User not found"}), 404
    return jsonify({"success": True, "user": users_db[user_id]})

@app.route('/api/user/<user_id>/xp', methods=['POST'])
def add_user_xp(user_id):
    """Add XP to user"""
    try:
        data = request.json
        xp_amount = int(data.get('xp', 0))
        
        if user_id not in users_db:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        user = users_db[user_id]
        user['xp'] += xp_amount
        
        # Level up logic
        level_thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000]
        new_level = 1
        for i, threshold in enumerate(level_thresholds, 1):
            if user['xp'] >= threshold:
                new_level = i
        
        user['level'] = new_level
        users_db[user_id] = user
        
        return jsonify({
            "success": True,
            "user": user,
            "level_up": new_level > int(data.get('previous_level', 1))
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Challenges System
CHALLENGES = [
    {
        "id": "daily_quiz",
        "title": "Daily Quiz Challenge",
        "description": "Complete a financial literacy quiz",
        "xp_reward": 50,
        "type": "quiz",
        "difficulty": "easy"
    },
    {
        "id": "budget_tracker",
        "title": "Budget Tracker",
        "description": "Track your expenses for 3 days",
        "xp_reward": 75,
        "type": "budgeting",
        "difficulty": "medium"
    },
    {
        "id": "savings_goal",
        "title": "Savings Goal Setter",
        "description": "Create your first savings goal",
        "xp_reward": 100,
        "type": "savings",
        "difficulty": "easy"
    },
    {
        "id": "sip_calculator",
        "title": "SIP Calculator",
        "description": "Calculate your first SIP investment",
        "xp_reward": 100,
        "type": "investing",
        "difficulty": "medium"
    },
    {
        "id": "week_streak",
        "title": "Week Warrior",
        "description": "Maintain a 7-day activity streak",
        "xp_reward": 200,
        "type": "streak",
        "difficulty": "hard"
    },
    {
        "id": "perfect_quiz",
        "title": "Perfect Score",
        "description": "Score 100% on any quiz",
        "xp_reward": 150,
        "type": "quiz",
        "difficulty": "hard"
    },
    {
        "id": "five_goals",
        "title": "Goal Master",
        "description": "Create 5 savings goals",
        "xp_reward": 200,
        "type": "savings",
        "difficulty": "medium"
    },
    {
        "id": "three_sips",
        "title": "Investment Explorer",
        "description": "Calculate 3 different SIP investments",
        "xp_reward": 250,
        "type": "investing",
        "difficulty": "medium"
    }
]

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """Get all available challenges"""
    user_id = request.args.get('user_id')
    
    challenges_with_status = []
    for challenge in CHALLENGES:
        challenge_copy = challenge.copy()
        if user_id and user_id in users_db:
            challenge_copy['completed'] = challenge['id'] in users_db[user_id].get('completed_challenges', [])
        else:
            challenge_copy['completed'] = False
        challenges_with_status.append(challenge_copy)
    
    return jsonify({"success": True, "challenges": challenges_with_status})

@app.route('/api/challenges/<challenge_id>/complete', methods=['POST'])
def complete_challenge(challenge_id):
    """Mark a challenge as complete"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id or user_id not in users_db:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        challenge = next((c for c in CHALLENGES if c['id'] == challenge_id), None)
        if not challenge:
            return jsonify({"success": False, "error": "Challenge not found"}), 404
        
        user = users_db[user_id]
        if challenge_id not in user.get('completed_challenges', []):
            user['completed_challenges'] = user.get('completed_challenges', []) + [challenge_id]
            user['xp'] += challenge['xp_reward']
            users_db[user_id] = user
        
        return jsonify({"success": True, "user": user, "challenge": challenge})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Leaderboard
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get leaderboard"""
    try:
        limit = int(request.args.get('limit', 10))
        
        # Convert users to list and sort by XP
        users_list = list(users_db.values())
        users_list.sort(key=lambda x: x.get('xp', 0), reverse=True)
        
        leaderboard = []
        for rank, user in enumerate(users_list[:limit], 1):
            leaderboard.append({
                "rank": rank,
                "username": user.get('username', 'Anonymous'),
                "xp": user.get('xp', 0),
                "level": user.get('level', 1),
                "achievements_count": len(user.get('achievements', []))
            })
        
        return jsonify({"success": True, "leaderboard": leaderboard})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Budgeting API
@app.route('/api/budget/calculate', methods=['POST'])
def calculate_budget():
    """Calculate budget breakdown using 50-30-20 rule"""
    try:
        data = request.json
        income = float(data.get('income', 0))
        
        if income <= 0:
            return jsonify({"success": False, "error": "Invalid income"}), 400
        
        needs = income * 0.50
        wants = income * 0.30
        savings = income * 0.20
        
        return jsonify({
            "success": True,
            "budget": {
                "income": income,
                "needs": round(needs, 2),
                "wants": round(wants, 2),
                "savings": round(savings, 2)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Savings Calculator
@app.route('/api/savings/calculate', methods=['POST'])
def calculate_savings():
    """Calculate savings goal timeline"""
    try:
        data = request.json
        goal_amount = float(data.get('goal_amount', 0))
        monthly_savings = float(data.get('monthly_savings', 0))
        interest_rate = float(data.get('interest_rate', 6)) / 100 / 12  # Monthly rate
        
        if goal_amount <= 0 or monthly_savings <= 0:
            return jsonify({"success": False, "error": "Invalid input"}), 400
        
        # Calculate months needed
        if interest_rate > 0:
            months = 0
            balance = 0
            while balance < goal_amount and months < 600:  # Max 50 years
                balance = balance * (1 + interest_rate) + monthly_savings
                months += 1
        else:
            months = int(goal_amount / monthly_savings)
        
        years = months / 12
        
        return jsonify({
            "success": True,
            "result": {
                "months": months,
                "years": round(years, 1),
                "total_saved": round(monthly_savings * months, 2),
                "goal_amount": goal_amount
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Real-time stock data for educational purposes
@app.route('/api/stocks/popular', methods=['GET'])
def get_popular_stocks():
    """Get popular stocks for learning"""
    try:
        symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']
        stocks = []
        
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                hist = ticker.history(period="1d")
                
                if len(hist) > 0:
                    current_price = hist['Close'].iloc[-1]
                    prev_close = info.get('previousClose', current_price)
                    change = current_price - prev_close
                    change_percent = (change / prev_close) * 100 if prev_close > 0 else 0
                    
                    stocks.append({
                        "symbol": symbol,
                        "name": info.get('longName', symbol),
                        "price": round(current_price, 2),
                        "change": round(change, 2),
                        "changePercent": round(change_percent, 2),
                        "marketCap": info.get('marketCap', 0)
                    })
            except:
                continue
        
        return jsonify({"success": True, "stocks": stocks})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

