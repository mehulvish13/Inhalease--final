# InhaleEase - Pre-Deployment Checklist ✓

**Date:** February 27, 2026  
**Status:** Review Complete  

---

## ✅ INFRASTRUCTURE & DEPENDENCIES

### Node.js Backend
- [x] Node.js installed: `v22.17.0`
- [x] npm installed: `v11.6.1`
- [x] `package.json` exists with proper scripts
- [x] `node_modules/` directory present and initialized
- [x] Required dependencies installed:
  - ✓ express@4.22.1
  - ✓ cors@2.8.6
  - ✓ dotenv@16.6.1
  - ✓ bcryptjs@2.4.3
  - ✓ jsonwebtoken@9.0.3
  - ✓ http-proxy-middleware@3.0.5
- [!] **WARNING**: Extraneous packages detected (MongoDB/Mongoose remnants)
  - Remove unused: mongoose, mongodb, bson, mpath, mquery, etc.
  - **Action**: Run `npm prune` to clean up

### Python Flask Backend
- [x] Python installed: `Python 3.13.5`
- [x] `requirements.txt` exists with Flask dependencies:
  - ✓ Flask==3.0.0
  - ✓ pandas==2.1.1
  - ✓ scikit-learn==1.3.1
  - ✓ Werkzeug==3.0.0
  - ✓ gunicorn==21.2.0
- [ ] **ACTION NEEDED**: Verify Flask dependencies are installed in production environment

---

## ✅ PROJECT STRUCTURE

### Directories Present
- [x] `backend/` - Node.js express server
- [x] `backend/config/` - Configuration files
- [x] `backend/controllers/` - Route controllers
- [x] `backend/models/` - Data models
- [x] `backend/routes/` - API routes
- [x] `backend/middleware/` - Express middleware
- [x] `backend/db/` - Data storage layer
- [x] `backend/public/` - Frontend assets
  - [x] index.html
  - [x] login.html
  - [x] signup.html
  - [x] dashboard.html
  - [x] css/style.css
  - [x] js/main.js, config.js
- [x] `backend/flask-app/` - Flask application
  - [x] app.py (206 lines)
  - [x] smartbreathe.db (SQLite database)
  - [x] templates/ (Flask templates)
  - [x] static/ (Static assets)
- [ ] **MISSING**: `frontend/` directory (referenced in render.yaml but not present)

---

## ⚠️ ENVIRONMENT & CONFIGURATION

### Environment Variables
**File:** `.env` - Located in `backend/`

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartbreathe
JWT_SECRET=supersecretjwtkey_smartbreathe_2026
```

**🔴 CRITICAL SECURITY ISSUES:**
1. **Hardcoded JWT_SECRET in .env** (exposed in repo)
   - [ ] Generate new secure secret before deployment
   - [ ] Use unique key (not reusable across deployments)
   
2. **Hardcoded MongoDB_URI** (not compatible with current architecture)
   - MongoDB is deprecated in this project (file-backed JSON storage)
   - [ ] Remove or update this variable
   
3. **.env file committed to repository**
   - [ ] Add `.env` to `.gitignore`
   - [ ] Use deployment platform secrets instead (Render, GitHub Secrets, etc.)

### Render.yaml Configuration
- [x] `render.yaml` present with 3 services defined
- [⚠️] **Issues Found:**
  1. Frontend service expects `frontend/` directory that doesn't exist
     - Current: frontend is served from `backend/public/`
     - Solution: Modify render.yaml to use correct path or add frontend directory
  2. Node backend specified with `/backend` root directory
  3. Flask app specified with `/backend/flask-app` - Correct

---

## ✅ APPLICATION CODE QUALITY

### Backend (Node.js)

**server.js Review:**
- [x] Express app properly configured
- [x] CORS enabled
- [x] JSON parsing middleware enabled
- [x] Static file serving configured (points to `backend/public/`)
- [x] Flask proxy middleware configured
- [x] Required routes mounted:
  - `/api/auth` - User authentication
  - `/api/users` - User management  
  - `/api/aqi` - Air quality index
- [x] Error handler implemented
- [x] Port configuration with fallback (5000)

**Authentication:**
- [x] JWT-based authentication implemented
- [x] Password hashing with bcryptjs
- [x] Token generation with expiry (30 days)
- [x] File-backed user storage (db/store.js)

### Backend (Flask/Python)

**app.py Review:**
- [x] Flask app initialized properly
- [x] Database (SQLite) initialization
- [x] User registration logic implemented
- [x] AI prediction algorithm for AQI risk scoring
- [x] Session management with secret key
- [⚠️] **Issue**: Secret key is hardcoded to 'smart-breathe-super-secret'
  - [ ] Change before deployment

---

## ⚠️ DATABASE & DATA

### Current Implementation
- [x] File-backed JSON storage (instead of MongoDB)
  - Storage: `backend/data/`
  - Users: `users.json`
  - AQI Data: `aqi.json`
  - Predictions: `predictions.json`
  
- [x] Flask uses SQLite:
  - File: `smartbreathe.db`
  - Location: `backend/flask-app/`

**Note:** Both Node backend and Flask backend have separate data stores
- [ ] **ACTION**: Ensure data synchronization strategy between Node (JSON) and Flask (SQLite)

---

## 🚀 DEPLOYMENT READINESS

### Render.yaml Services

#### Service 1: Flask Web Service
```yaml
name: inhaleease-flask
buildCommand: pip install -r requirements.txt
startCommand: gunicorn app:app
rootDir: backend/flask-app
```
- [x] Configuration looks correct
- [x] Python version specified: 3.10.0
- [⚠️] Consider updating Python version to 3.11+ for better performance

#### Service 2: Node Backend
```yaml
name: inhaleease-node-backend
buildCommand: npm install
startCommand: npm start
rootDir: backend
```
- [x] Configuration correct
- [⚠️] NODE_ENV=production set but verify all production configs

#### Service 3: Static Frontend
```yaml
name: inhaleease-frontend
staticPublishPath: ./
rootDir: frontend
```
- [❌] **BROKEN**: `frontend/` directory doesn't exist
  - **Fix Options:**
    1. Create `frontend/` directory with HTML/CSS/JS
    2. Modify to serve from `backend/public/` instead
    3. Consolidate into single Node backend service

---

## 🔒 SECURITY CHECKLIST

- [ ] **URGENT**: Change hardcoded JWT_SECRET (`supersecretjwtkey_smartbreathe_2026`)
- [ ] **URGENT**: Change Flask secret key (`smart-breathe-super-secret`)
- [ ] **URGENT**: Remove `.env` from git history (`git rm --cached .env`)
- [ ] Remove MongoDB references from configuration
- [ ] Remove extraneous npm packages (`npm prune`)
- [ ] Add `.env.example` with placeholder values for developers
- [ ] Review CORS configuration for production domain
- [ ] Verify Flask CORS headers for security
- [ ] Check authentication token expiry settings (currently 30 days - consider reducing)

---

## 📋 REQUIRED ACTIONS BEFORE DEPLOYMENT

### High Priority (Must Fix)
1. **Fix render.yaml frontend service** - path doesn't exist
2. **Secure environment variables** - store in Render secrets, NOT in git
3. **Change hardcoded secrets** - JWT_SECRET and Flask secret
4. **Clean up dependencies** - remove extraneous npm packages
5. **Verify data persistence** - test that JSON files persist in Render

### Medium Priority (Should Fix)
6. Test Flask app start with `gunicorn`
7. Test Node app in production mode
8. Verify proxy between Node and Flask services
9. Test authentication flow end-to-end
10. Verify static file serving from backend/public

### Low Priority (Nice to Have)
11. Add request logging/monitoring
12. Implement rate limiting on auth endpoints
13. Add HTTPS redirect configuration
14. Set up error tracking (Sentry, etc.)

---

## ✨ LOCAL TESTING COMMANDS

```bash
# Backend setup
cd backend
npm install
npm start
# Expected: Server running on port 5000

# Flask setup (in separate terminal)
cd backend/flask-app
pip install -r requirements.txt
python app.py
# Expected: Flask running on port 5005

# Test endpoints
curl http://localhost:5000/
curl http://localhost:5000/api/aqi
```

---

## 📝 DEPLOYMENT STEPS

1. **Clone to Render**
   - Connect GitHub repository to Render
   - Import `render.yaml` blueprint
   
2. **Configure Environment Variables** (in Render Dashboard)
   ```
   PORT=5000
   FLASK_URL=http://localhost:5005
   JWT_SECRET=[NEW_SECURE_SECRET]
   NODE_ENV=production
   ```

3. **Fix Frontend Service**
   - Option A: Update render.yaml to use `backend/public`
   - Option B: Create actual `frontend/` directory

4. **Monitor Deployment**
   - Check build logs for errors
   - Verify both services start successfully
   - Test API endpoints in staging

---

**Generated:** Pre-Deployment Checklist  
**Next Step:** Address HIGH PRIORITY items before proceeding to deployment
