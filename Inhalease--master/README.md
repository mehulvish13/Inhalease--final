# InhaleEase

An AI-driven air quality monitoring and respiratory health prediction platform.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript (Netlify)
- **Backend:** Node.js, Express.js (Render)
- **Auth:** JWT + bcryptjs
- **Storage:** File-backed JSON (no external database)
- **AI/Predictions:** Pure JavaScript — no external ML libraries

## Project Structure

```
Inhalease--master/
├── backend/               # Node.js Express API (port 5000)
│   ├── server.js
│   ├── controllers/       # Route handlers
│   ├── routes/            # API routes
│   ├── utils/
│   │   └── aiPredictionModel.js   # AI logic (pure JS)
│   ├── middleware/        # JWT auth middleware
│   ├── db/store.js        # File-backed JSON storage
│   ├── data/              # JSON data files
│   └── public/            # Served static files
└── render.yaml            # Render deployment config
```

```
frontend/                  # Static frontend (Netlify)
├── index.html
├── dashboard.html
├── login.html
├── signup.html
├── css/style.css
└── js/
    ├── config.js          # API endpoint config (auto-detects local vs production)
    └── main.js
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/users/profile` | Yes | Get user profile |
| GET | `/api/aqi/live` | Yes | Current AQI + health recommendations |
| GET | `/api/aqi/predict` | Yes | Tomorrow's AQI prediction |
| GET | `/api/aqi/history` | Yes | User's AQI history |
| GET | `/api/aqi/advanced` | Yes | Advanced health metrics + wearable data |

## Running Locally

```bash
# Option 1: double-click start.bat (Windows)

# Option 2: manual
cd Inhalease--master/backend
npm install
# Create .env with JWT_SECRET=<your-secret>
npm start
# Open http://localhost:5000
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment

**Backend → Render**
- Root directory: `Inhalease--master/backend`
- Build: `npm install`
- Start: `npm start`
- Environment variable: `JWT_SECRET=<your-secret>`

**Frontend → Netlify**
- Base directory: `frontend`
- No build command needed
- Update `frontend/js/config.js` with your Render backend URL

