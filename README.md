# Real-Time Football Statistics Web Application

Welcome to the **Real-Time Football Statistics Web Application**! This repository houses a highly polished, full-stack relational platform featuring live match progressions, goal scoring WebSocket notifications, fixture search, league standings tables, and favorite club tracking.

---

## 🏗️ PROJECT ARCHITECTURE

```text
football-project/
├── backend-express/              # Node.js + Express + Socket.IO Server (API/Real-Time Gateway)
│   ├── data/                     # Local fallback caches
│   └── src/
│       ├── config/               # DB connects, Redis, and Socket managers
│       ├── controllers/          # Business logic handlers
│       ├── routes/               # API endpoint registrations
│       ├── services/             # Match progress simulator & websockets broadcaster
│       ├── middlewares/          # Global error and 404 catches
│       └── sockets/              # Custom room subscriptions handshakes
├── data-engine-laravel/          # Laravel 12 Scheduler + Queue Engine (Crawler & Sync)
│   └── app/
│       ├── Services/             # API-Football integrators
│       ├── Jobs/                 # Scheduling sync pipelines
│       ├── Models/               # Supabase PG models
│       └── Console/              # Console scheduler kernel
├── src/                          # Vite + React (TypeScript) Dashboard Client
│   ├── components/               # Modular bento dashboard panel components
│   └── App.tsx                   # Central event receiver, toasts registry & layout
├── README.md                     # Deployment handbook & setup guide
└── package.json                  # Workspace manifests & compiled launchers
```

---

## ⚡ TECH STACK & CLOUD SERVICES

*   **Frontend**: React (Vite, TypeScript, Tailwind CSS, Lucide Icons, motion) → **Deploy to Vercel**
*   **API & Sockets**: Node.js + Express + Socket.IO → **Deploy to Railway**
*   **Data Engine**: Laravel 12 (PHP 8.2+) Scheduler Tasks → **Deploy to Railway**
*   **Database**: Supabase PostgreSQL (Single Source of Truth)
*   **Cache**: Upstash Redis (Serverless High-Performance Caching)

---

## 🛠️ LOCAL DEVELOPMENT LAUNCH

The workspace features a **unified full-stack environment** matching the sandboxed preview. 

### 1. Configure Secrets (`.env` or Railway Env)
Create `.env` inside the root:
```env
PORT=3000
SUPABASE_DB_URL="postgresql://postgres:[password]@db.[supabase-id].supabase.co:5432/postgres"
REDIS_URL="redis://default:[token]@upstash.io:6379"
```

### 2. Boot App
```bash
# Install dependencies
npm install

# Run unified full-stack App (Vite Dev Server + Express + WebSockets + Match progression simulations)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live dashboard!

---

# 🚀 DEPLOYMENT COMPREHENSIVE RUNBOOKS (STEPS 6 - 10)

These blueprints outline how to compile, test, and host each distinct service.

---

## 📝 STEP 6: DOCKER DEPLOYMENT CONFIGURATIONS

### 1. API & WebSocket Server (`Dockerfile.express`)
Place this inside `/backend-express/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

### 2. Laravel Data Engine Sync (`Dockerfile.laravel`)
Place this inside `/data-engine-laravel/Dockerfile`:
```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies and PostgreSQL driver extensions
RUN apk add --no-cache libpq-dev git unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-dev --optimize-autoloader

# Run database migrations and boot crontab scheduler daemon
CMD ["php", "artisan", "schedule:work"]
```

---

## 🔧 STEP 7: GITHUB ACTIONS CI/CD WORKFLOWS

Create a workflow file inside `.github/workflows/deploy.yml` to trigger tests and automatic production deployments upon merge to main.

```yaml
name: Football App Production Build & Deploy

on:
  push:
    branches: [ main ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Node Dependencies
        run: npm ci

      - name: Run TypeScript Linter Check
        run: npm run lint

      - name: Test Production Build
        run: npm run build

  deploy-railway:
    needs: test-and-lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Railway CLI
        run: npm i -g @railway/cli

      - name: Deploy Express Server API
        run: railway up --service express-backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_API_TOKEN }}

      - name: Deploy Laravel Data Engine Sync
        run: railway up --service laravel-scheduler
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_API_TOKEN }}
```

---

## ☁️ STEP 8: RAILWAY BACKEND & ENGINE DEPLOYMENT

### Service 1: `express-backend` (REST API & WS Sockets)
1.  Log in to [Railway.app](https://railway.app).
2.  Select **New Project** → **Github Repository** → Select this repo.
3.  Configure variables under **Variables** tab:
    *   `PORT` = `3000`
    *   `SUPABASE_DB_URL` = (Your Supabase PostgreSQL connect string URL)
    *   `REDIS_URL` = (Your Upstash Redis connection string URL)
4.  Specify root directory `CWD` to `/` (express will be triggered by the start bundle configured inside `package.json`'s `node dist/server.cjs`).

### Service 2: `laravel-scheduler` (Sync Worker)
1.  Add a second service in the project pointing to the same repository.
2.  Specify root directory `CWD` or Root Directory to `/data-engine-laravel`.
3.  Configure Variables:
    *   `DB_CONNECTION` = `pgsql`
    *   `DB_HOST` = (Supabase host address)
    *   `DB_DATABASE` = `postgres`
    *   `DB_USERNAME` = (Supabase PostgreSQL master username)
    *   `DB_PASSWORD` = (Supabase password)
    *   `FOOTBALL_API_KEY` = (Your API-Football developer credential)
4.  Railway automatically recognizes the PHP directory, installs dependencies via composer, and runs the container. Ensure the start start command is configured to:
    `php artisan schedule:work`

---

## 🌐 STEP 9: VERCEL FRONTEND SPA DEPLOYMENT

Vercel is the premier platform to host the compiled React Single Page Application.

1.  Log in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2.  Import repository from GitHub.
3.  Configure Build Settings:
    *   **Framework Preset**: Vite / Other (Auto-detected).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  Configure Client Environment Variables in Settings panel:
    *   `NEXT_PUBLIC_API_URL` = (Set to public Railway service url of your Express app, e.g., `https://express-backend.up.railway.app`)
    *   `NEXT_PUBLIC_SOCKET_URL` = (Same Railway backend URL to bind realtime sockets)
5.  Click **Deploy**. Complete!

---

## ✅ STEP 10: PRODUCTION GO-LIVE CHECKLIST (15-POINT AUDIT)

Prior to releasing this platform to fans and public visitors:

### 🔒 Database & Authentication Security
- [ ] 1. **Rotate Supabase master credentials** and implement Least-Privilege IAM users for Laravel connection pools.
- [ ] 2. Activate SSL verification inside node backend Postgres connector options (`ssl: { rejectUnauthorized: true }`).
- [ ] 3. Enable standard Firestore-like row level permissions (RLS) on Supabase postgres tables.

### 💨 Performance & Caching Tuning
- [ ] 4. Audit **Upstash Redis connection strings** and confirm standard timeouts represent our selected TTL policies (30s live, 1hr standings).
- [ ] 5. Confirm GZip page content compressions are active inside Express production middleware chains.
- [ ] 6. Ensure image responsive dimensions fit Unsplash URLs with layout width bounding.

### 📡 WebSocket & Network Stability
- [ ] 7. Turn on **polling fallbacks** inside Socket.IO connection configurations to support browser clients behind highly strict corporate firewalls.
- [ ] 8. Verify the Node cluster binds safely to port 3000 ingress with high-performance event triggers.
- [ ] 9. Enforce DDoS protection rates limiting on REST API endpoints (`express-rate-limit`).

### 📦 App Stability & Monitoring
- [ ] 10. Configure **Sentry Error Tracking** alerts inside both Laravel & Node servers to catch unexpected runtime database outages.
- [ ] 11. Schedule weekly SQL database backup dump scripts inside Supabase cron dashboards.
- [ ] 12. Run TypeScript build checks to confirm 100% compile compliance.

### ⚽ Data Integrity & API Limits
- [ ] 13. Double-check **API-Football API plan quota thresholds** to guarantee background sync cron schedules do not exceed daily rate limits.
- [ ] 14. Turn on queuing workers to distribute heavy player roster synchronizations evenly across hours.
- [ ] 15. Verify that client favorites persistence degrades gracefully to offline modes during regional drops.
