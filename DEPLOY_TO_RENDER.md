# InhaleEase - Quick Deployment Guide

## 🚀 Deploy to Render in 5 Steps

### Step 1: Generate Secure Secrets
Generate two strong random strings (use a password generator or run this):

**For Linux/Mac:**
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate FLASK_SECRET  
openssl rand -base64 32
```

**For Windows PowerShell:**
```powershell
# Generate JWT_SECRET
$bytes = [byte[]]::new(32); [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)

# Generate FLASK_SECRET
$bytes = [byte[]]::new(32); [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Security improvements: externalize secrets, fix render.yaml, cleanup dependencies"
git push origin main
```

### Step 3: Create Render Services
1. Go to [render.com](https://render.com)
2. Click "New +" → "Multi-Service Blueprint"
3. Select your GitHub repository
4. Click "Create from Blueprint"
5. Render will automatically read `render.yaml` and create 3 services

### Step 4: Add Environment Variables to Render
For **inhaleease-node-backend** service:
- `JWT_SECRET` = (value from Step 1)
- `NODE_ENV` = `production`
- `FLASK_URL` = `http://localhost:5005`

For **inhaleease-flask** service:
- `FLASK_SECRET` = (value from Step 1)

For **inhaleease-frontend** service:
- No variables needed (static files)

### Step 5: Deploy
1. Click the "Deploy" button
2. Monitor the build logs
3. Once all services show "Live", test your app:
   - https://your-app.onrender.com/
   - Test API: https://your-app.onrender.com/api/aqi

---

## ✅ What's Been Fixed

| Issue | Fix | Status |
|-------|-----|--------|
| Frontend path error | Updated render.yaml to `backend/public` | ✅ |
| Hardcoded JWT_SECRET | Externalized to env variable | ✅ |
| Hardcoded Flask secret | Externalized to env variable | ✅ |
| .env exposed in git | Created .gitignore | ✅ |
| MongoDB dependencies | Cleaned with npm prune | ✅ |
| Security vulnerabilities | Fixed with npm audit fix | ✅ |

---

## 🧪 Local Testing (Before Deployment)

### Test Backend Locally
```bash
cd backend
npm install
npm start
# Visit http://localhost:5000
```

### Test Flask Locally
```bash
cd backend/flask-app
pip install -r requirements.txt
python app.py
# Visit http://localhost:5005
```

---

## 🔒 Security Checklist

Before deploying:
- [ ] Generated new JWT_SECRET
- [ ] Generated new FLASK_SECRET
- [ ] Added secrets to Render environment variables
- [ ] Verified .env is in .gitignore
- [ ] Verified .env is NOT in git history
- [ ] Tested locally with new secrets
- [ ] Confirmed .env.example is in repo (but not .env)

---

## 📞 Troubleshooting

### Service fails to start
1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Check `console.log` output in logs

### Port already in use
- Render assigns ports automatically, shouldn't be an issue in production

### Database file not persisting
- By default, file-based storage won't persist across Render restarts
- **Solution:** Switch to a cloud database (MongoDB Atlas) for production

### Flask can't be accessed from Node
- Ensure Flask service is fully deployed first
- Check the internal URL in render.yaml

---

## 📚 More Info

- **Render Docs:** https://render.com/docs
- **Node.js Deployment:** https://render.com/docs/deploy-node
- **Python Deployment:** https://render.com/docs/deploy-python
- **Blueprint Docs:** https://render.com/docs/blueprint-spec

