# FinLearn Backend API

Flask backend for the FinLearn gamified financial literacy platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/funds` - Get mutual funds with live data
- `POST /api/sip/calculate` - Calculate SIP returns
- `GET /api/stock/quote?symbol=AAPL` - Get stock quote
- `GET /api/market/trends` - Get market trends

## Environment Variables

No API keys required for basic functionality. Yahoo Finance data is accessed via yfinance library.

