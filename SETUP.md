# 🚀 Setup Guide - FinLearn Pro

## Quick Setup (5 minutes)

### Step 1: Prerequisites Check
```bash
# Check Python version (need 3.8+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### Frontend
```bash
npm install
```

### Step 3: Start the Application

#### Option A: Using Startup Script (Recommended)
```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 4: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Detailed Setup

### Backend Setup

1. **Create Virtual Environment (Optional but Recommended)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Verify Installation**
```bash
python app.py
# Should see: "Running on http://0.0.0.0:5000"
```

3. **Test API**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"healthy","message":"FinLearn API is running"}
```

### Frontend Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Verify Installation**
```bash
npm run dev
# Should start Vite dev server on port 3000
```

3. **Build for Production (Optional)**
```bash
npm run build
# Creates optimized build in 'dist' folder
```

## Troubleshooting

### Backend Issues

**Issue: Port 5000 already in use**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Or change port in app.py
# port = int(os.environ.get('PORT', 5001))
```

**Issue: Module not found errors**
```bash
# Reinstall dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt
```

**Issue: yfinance errors**
```bash
# Update yfinance
pip install --upgrade yfinance
```

### Frontend Issues

**Issue: Port 3000 already in use**
```bash
# Change port in vite.config.js
server: {
  port: 3001,
}
```

**Issue: Node modules corrupted**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Issue: Build errors**
```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run build
```

### Common Issues

**Issue: CORS errors**
- Backend has CORS enabled by default
- If issues persist, check `backend/app.py` for CORS configuration

**Issue: API calls failing**
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify proxy settings in `vite.config.js`

**Issue: Data not persisting**
- Data is stored in localStorage
- Clear browser cache if issues occur
- Check browser console for localStorage errors

## Environment Variables (Optional)

Create a `.env` file in the backend directory:

```env
PORT=5000
FLASK_ENV=development
YAHOO_FINANCE_API_KEY=your_key_here  # Not required, yfinance is free
```

## Production Deployment

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Frontend (Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Backend (Heroku)
1. Create `Procfile`:
```
web: python backend/app.py
```
2. Deploy to Heroku
3. Set environment variables

### Backend (Railway)
1. Connect GitHub repository
2. Set start command: `python backend/app.py`
3. Deploy

## Development Tips

### Hot Reload
- Frontend: Vite provides instant hot reload
- Backend: Flask auto-reloads on file changes

### Debugging
- Frontend: Use React DevTools browser extension
- Backend: Use Python debugger or print statements
- API: Use Postman or curl for testing

### Code Formatting
```bash
# Install Prettier (optional)
npm install --save-dev prettier

# Format code
npx prettier --write "src/**/*.{js,jsx}"
```

## Next Steps

1. ✅ Application is running
2. 📖 Read README.md for feature overview
3. 📚 Check PROJECT_GUIDE.md for architecture details
4. 🎮 Start using the application!
5. 🛠️ Customize as needed

## Support

If you encounter issues:
1. Check this guide
2. Review error messages
3. Check browser console
4. Verify all dependencies are installed
5. Ensure ports are available

---

**Happy Coding! 🚀**

