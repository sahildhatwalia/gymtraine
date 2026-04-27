# 🏋️ AI Fitness Coach

An AI-powered personal fitness coach built with **React + Vite** (client) and **Node.js + Express** (server), using **Groq AI** for intelligent workout/diet plan generation.

---

## 📁 Project Structure

```
ai-fitness-coach/
├── client/          # React + Vite frontend
│   ├── src/
│   ├── .env.example
│   └── vite.config.js
├── server/          # Node.js + Express backend
│   ├── index.js
│   └── .env.example
├── package.json     # Root workspace (run both together)
└── .gitignore
```

---

## ⚡ Quick Start (Run Both Together)

```bash
# 1. Install all dependencies (root + client + server)
npm run install:all

# 2. Set up environment variables
cp server/.env.example server/.env   # then edit server/.env
# (client/.env is optional in development — the proxy handles API routing)

# 3. Start both client and server simultaneously
npm run dev
```

| Service | URL |
|---------|-----|
| Client  | http://localhost:5173 |
| Server  | http://localhost:5000 |

> **Dev note:** In development, Vite proxies all `/api` calls from the client to `localhost:5000` — no CORS issues, no extra config needed.

---

## 🖥️ Running Separately

### Client

```bash
cd client

# Install
npm install

# Development
npm run dev          # → http://localhost:5173

# Production build
npm run build        # outputs to client/dist/

# Preview production build locally
npm run preview      # → http://localhost:4173
```

**Environment variables** (`client/.env`):
```bash
# Leave empty in development (proxy handles it)
# Set to your deployed server URL in production:
VITE_API_URL=https://your-server.onrender.com
```

---

### Server

```bash
cd server

# Install
npm install

# Development (auto-restart on file changes)
npm run dev          # → http://localhost:5000

# Production
npm start
```

**Environment variables** (`server/.env`):
```bash
MONGO_URI=mongodb://localhost:27017/ai-fitness-coach
JWT_SECRET=replace_with_a_strong_random_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
CLIENT_URL=                  # leave empty for dev; set to client URL in prod
```

---

## 🚀 Deployment

### Option A — Separate Deployments (Recommended)

| Part   | Platform             | Notes |
|--------|----------------------|-------|
| Server | [Render](https://render.com) / [Railway](https://railway.app) | Set all env vars in dashboard |
| Client | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) | Set `VITE_API_URL` to your server URL |

**After deploying the server**, set on the client host:
```
VITE_API_URL=https://your-server.onrender.com
```

**After deploying the client**, set on the server host:
```
CLIENT_URL=https://your-client.vercel.app
```

### Option B — Serve Client from Server (Single Deployment)

1. Build the client: `npm run build:client`
2. The server already serves `client/dist` when `NODE_ENV=production`
3. Deploy the **server** folder (with the built `client/dist` inside)

---

## 🛠 Root Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server concurrently |
| `npm run dev:client` | Run client only |
| `npm run dev:server` | Run server only |
| `npm run build:client` | Build client for production |
| `npm run install:all` | Install all dependencies |
| `npm run install:client` | Install client dependencies only |
| `npm run install:server` | Install server dependencies only |

---

## 📋 Prerequisites

- Node.js v18+
- MongoDB (local) or a MongoDB Atlas URI
- A [Groq API key](https://console.groq.com)