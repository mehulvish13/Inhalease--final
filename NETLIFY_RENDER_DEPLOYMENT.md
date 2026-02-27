# InhaleEase - Netlify + Render Hybrid Deployment Guide

**Date:** February 27, 2026  
**Deployment Strategy:** Frontend on Netlify, Backend on Render  
**Status:** Ready to Deploy ✅

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   INHALEASE DEPLOYMENT                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────┐      ┌──────────────────────┐  │
│  │   NETLIFY            │      │   RENDER             │  │
│  │  (Frontend CDN)      │      │  (Backend Servers)   │  │
│  │                      │      │                      │  │
│  │  • index.html        │      │  ┌────────────────┐  │  │
│  │  • login.html        │      │  │   Node.js API  │  │  │
│  │  • signup.html       │◄────────►│ :5000          │  │  │
│  │  • dashboard.html    │      │  │ /api/auth      │  │  │
│  │  • css/              │      │  │ /api/aqi       │  │  │
│  │  • js/ (config.js)   │      │  └────────────────┘  │  │
│  │                      │      │                      │  │
│  │  Domain:             │      │  ┌────────────────┐  │  │
│  │  yourdomain.com      │      │  │   Flask AI     │  │  │
│  │  or *.netlify.app    │      │  │ :5005          │  │  │
│  │                      │      │  │ /predict       │  │  │
│  │                      │      │  └────────────────┘  │  │
│  └──────────────────────┘      └──────────────────────┘  │
│                    ▲                     ▲                │
│                    │                     │                │
│       API Calls    │     HTTP Proxy      │                │
│       (CORS)       │     (backends)      │                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 PHASE 1: Prepare Code for Deployment

### ✅ Completed
- [x] Frontend directory created (`/frontend`)
- [x] All HTML files copied and ready
- [x] CSS and JS files configured
- [x] `config.js` updated to detect environment and route APIs
- [x] `netlify.toml` created with proper configuration
- [x] `render.yaml` updated (frontend service removed)
- [x] Environment variables externalized in `.env`
- [x] `.gitignore` created to protect secrets
- [x] Dependencies cleaned with `npm prune`

---

## 🔧 PHASE 2: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
cd c:\Users\Pcc\Downloads\Inhalease--main\Inhalease--try1
git add .
git commit -m "Hybrid deployment: Netlify frontend + Render backend"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Backend Services
1. From Render Dashboard: **New ➜ Multi-Service Blueprint**
2. Select your GitHub repository
3. Click **Create from Blueprint**
4. Render will read `render.yaml` and create services automatically

### Step 4: Set Environment Variables in Render

**For `inhaleease-node-backend` service:**
1. Click on service name
2. Go to **Environment**
3. Add variables:
   ```
   JW_SECRET = [Generate secure 32-char key]
   FLASK_URL = http://localhost:5005
   NODE_ENV = production
   ```

**For `inhaleease-flask` service:**
1. Click on service name
2. Go to **Environment**
3. Add variables:
   ```
   FLASK_SECRET = [Generate secure 32-char key]
   ```

### Step 5: Verify Backend Deployment
- Wait for services to go **"Live"** (5-10 minutes)
- Note the URLs:
  - Node Backend: `https://inhaleease-node-backend.onrender.com`
  - Flask: `https://inhaleease-flask.onrender.com`
- Test endpoints:
  ```bash
  curl https://inhaleease-node-backend.onrender.com/api/aqi/live?city=NewYork
  ```

---

## 🌐 PHASE 3: Deploy Frontend to Netlify

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Create New Site from Git
1. Click **Add new site ➜ Import an existing project**
2. Select GitHub
3. Choose your repository
4. **Configure:**
   - **Base directory:** `frontend`
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (frontend root)
5. Click **Deploy site**

### Step 3: Set Environment Variables in Netlify
1. Go to **Site Settings ➜ Environment**
2. Add build environment variables:
   ```
   REACT_APP_API_URL = https://inhaleease-node-backend.onrender.com/api
   ```
3. **Redeploy** the site

### Step 4: Configure Custom Domain (Optional)
1. Go to **Site Settings ➜ Domain**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS setup instructions

### Step 5: Verify Frontend Deployment
- Visit your Netlify URL: `https://yourdomain.netlify.app`
- Pages should load correctly
- Test login/signup (should connect to Render backend)

---

## 🔌 Cross-Origin Configuration

### CORS Setup on Render Backend
Update `backend/server.js` to allow Netlify domain:

```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'https://yourdomain.netlify.app',
        'https://yourdomain.com'
    ],
    credentials: true
}));
```

---

## 📊 API Communication Flow

When user signs up on Netlify frontend:

```
1. User types email/password on https://yourdomain.netlify.app/signup.html
   ↓
2. Frontend JavaScript calls:
   fetch('https://inhaleease-node-backend.onrender.com/api/auth/signup', {...})
   ↓
3. Node backend processes request, saves to JSON files
   ↓
4. Response sent back to frontend (JWT token)
   ↓
5. Frontend stores token in localStorage
   ↓
6. On dashboard navigation, frontend calls:
   fetch('https://inhaleease-node-backend.onrender.com/api/aqi/live?city=...', {...})
   ↓
7. Node backend proxies to Flask:
   http://localhost:5005 (internal Render network)
   ↓
8. Flask returns AI predictions
   ↓
9. Response sent to frontend dashboard
```

---

## 🔐 Security Configuration

### 1. Generate Secure Secrets
**PowerShell:**
```powershell
# Generate JWT_SECRET
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Output: Copy this to Render environment variable JWT_SECRET

# Generate FLASK_SECRET
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Output: Copy this to Render environment variable FLASK_SECRET
```

### 2. Update Render Environment Variables
Never commit secrets to git. Set them in Render Dashboard:
- `inhalease-node-backend` → Environment:
  - `JWT_SECRET`
  - `FLASK_URL`
  - `NODE_ENV=production`
  
- `inhalease-flask` → Environment:
  - `FLASK_SECRET`

### 3. CORS Headers
Render will auto-configure CORS. Verify with:
```bash
curl -i -X OPTIONS https://inhaleease-node-backend.onrender.com/api/auth/login
```

---

## ✅ Testing Checklist

### Local Testing (Before Final Deployment)
```bash
# Terminal 1: Node Backend
cd backend
npm start
# Should run on http://localhost:5000

# Terminal 2: Flask (optional)
cd backend/flask-app
python app.py
# Should run on http://localhost:5005

# Terminal 3: Test frontend locally
# Open frontend/index.html in browser
```

### Staging Testing (After Netlify Deployment)

- [ ] Visit `https://yourdomain.netlify.app`
- [ ] Check page loads (no CORS errors)
- [ ] Click "Sign Up" button
- [ ] Fill form with test data
- [ ] Submit signup form
- [ ] Verify API call succeeds (check Network tab in DevTools)
- [ ] Check token stored in localStorage
- [ ] Visit dashboard, verify AQI data loads
- [ ] Try location detection
- [ ] Test logout

### Production Verification

```bash
# Test API endpoints from frontend
curl https://yourdomain.netlify.app/api/aqi/live?city=NewYork
# Should work through proxy

# Check CORS headers
curl -i https://inhaleease-node-backend.onrender.com/api/auth/signup
# Should see Access-Control-Allow-Origin header
```

---

## 📱 File Structure After Setup

```
/  (GitHub root)
├── frontend/                    (Deployed to Netlify)
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── js/
│   │   ├── config.js           (← Configures API_BASE_URL)
│   │   └── main.js
│   ├── css/
│   │   └── style.css
│   ├── netlify.toml            (← Netlify config)
│   └── images/
│
├── Inhalease--master/backend/   (Deployed to Render)
│   ├── package.json
│   ├── server.js               (← Node backend)
│   ├── .env                    (← Environment variables)
│   ├── flask-app/
│   │   ├── app.py              (← Flask AI service)
│   │   ├── requirements.txt
│   │   └── ...
│   └── ...
│
├── render.yaml                 (← Backend deployment config)
├── .gitignore                  (← Protects secrets)
└── .env.example                (← Template for developers)
```

---

## 🔄 Continuous Deployment

### Auto-Deploy from Git

**Render:**
- Automatically deploys when you push to `main`
- Monitor builds in Render Dashboard

**Netlify:**
- Automatically deploys when you push to `main`
- Monitor builds in Netlify Dashboard

### Making Updates

```bash
# Make changes locally
git add .
git commit -m "Feature: Add new alerts section"
git push origin main

# → Render automatically redeploys backend
# → Netlify automatically redeploys frontend
# → Both go live within 2-5 minutes
```

---

## 🐛 Troubleshooting

### "Cannot find module" on Render
**Solution:** Run `npm install` locally and push `package-lock.json`
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### CORS errors on frontend
**Solution:** Check CORS configuration in `backend/server.js`
```javascript
app.use(cors({
    origin: 'https://yourdomain.netlify.app',
    credentials: true
}));
```

### Frontend shows "undefined" API URL
**Solution:** Check `frontend/js/config.js` and Netlify environment variables
```bash
# Should see in Network tab:
# fetch('https://inhaleease-node-backend.onrender.com/api/auth/login')
```

### Flask service not responding
**Solution:** Check if service is running in Render Dashboard
- Click on `inhaleease-flask` service
- Check build logs for errors
- Verify `requirements.txt` has gunicorn installed

### Data not persisting
**Solution:** File-based JSON storage won't persist across Render restarts
**Future:** Switch to MongoDB Atlas for persistent database

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- **Node.js on Render:** https://render.com/docs/deploy-node
- **Python on Render:** https://render.com/docs/deploy-python
- **CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## ✨ Next Steps

1. **Commit all changes to GitHub**
   ```bash
   git add .
   git commit -m "Hybrid deployment setup: Netlify + Render"
   git push
   ```

2. **Deploy Render backend** (follow Phase 2 above)

3. **Deploy Netlify frontend** (follow Phase 3 above)

4. **Update config.js** if custom domain is different:
   ```javascript
   config.API_BASE_URL = 'https://YOUR-RENDER-BACKEND-URL/api'
   ```

5. **Test all features** on staging

6. **Go live!** 🎉

---

**Deployment Status:** ✅ Ready for hybrid deployment  
**Last Updated:** February 27, 2026

