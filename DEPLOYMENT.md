# HeartGuard AI — Production Deployment Guide

This guide provides step-by-step instructions for deploying HeartGuard AI to production across modern cloud providers.

---

## Option 1: 1-Click Cloud Deployment (Render.com) — *Fastest & Free*

HeartGuard AI includes a ready-to-deploy **`render.yaml`** blueprint that provisions both the Python ML API and the React Static Site automatically.

### Steps:
1. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Connect your GitHub repository: `https://github.com/praneethbadugu7781-create/heartai`.
4. Render will automatically detect `render.yaml` and create:
   - **`heartguard-api`** (FastAPI Python backend with PyTorch inference)
   - **`heartguard-web`** (React + TypeScript frontend static site)
5. Click **Apply**.
6. Once deployed, copy your backend URL (e.g., `https://heartguard-api.onrender.com`) and set it in your frontend or reverse proxy.

---

## Option 2: Split Deploy (Vercel Frontend + Railway/Render Backend)

### A. Deploy Backend on Railway or Render
1. Create a new Web Service pointing to the root repository or `backend/` subfolder.
2. Build Command: `cd backend && pip install -r requirements.txt && python train_models.py`
3. Start Command: `cd backend && python run_server.py`
4. Note your public backend URL: `https://your-api.railway.app` or `https://heartguard-api.onrender.com`.

### B. Deploy Frontend on Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import repository `praneethbadugu7781-create/heartai`.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. In `frontend/vercel.json`, replace `https://YOUR_BACKEND_URL` with your actual live backend URL.
6. Click **Deploy**.

---

## Option 3: Docker & Docker Compose (Any VPS / Cloud Server)

HeartGuard AI includes a multi-container Docker configuration with MongoDB, FastAPI, and Nginx.

### Run with Docker Compose:
```bash
# Clone repository
git clone https://github.com/praneethbadugu7781-create/heartai.git
cd heartai

# Build and start all 3 containers (MongoDB + Backend + Frontend)
docker-compose up -d --build
```

### Container Endpoints:
- **Web Application**: `http://localhost` (Port 80)
- **FastAPI API & Docs**: `http://localhost:8000/docs` (Port 8000)
- **MongoDB**: `localhost:27017`

---

## Option 4: Deploying to AWS EC2 / DigitalOcean Droplet / Ubuntu Server

```bash
# 1. Update system packages
sudo apt update && sudo apt install -y python3-pip python3-venv nodejs npm git

# 2. Clone repository
git clone https://github.com/praneethbadugu7781-create/heartai.git
cd heartai

# 3. Setup Python Backend Virtual Environment
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
python backend/train_models.py

# 4. Run Backend with systemd or PM2
pm2 start "python backend/run_server.py" --name heartguard-api

# 5. Build and Serve Frontend
cd frontend
npm install
npm run build
pm2 start "npm run preview -- --port 80 --host" --name heartguard-web
```

---

## Verifying Deployment Health

Once your backend is live, verify the health status:
```bash
curl https://your-backend-url/api/v1/health
```

Expected JSON:
```json
{
  "status": "healthy",
  "service": "HeartGuard AI Backend API",
  "models": {
    "loaded": true,
    "architectures": ["DNN (4-Layer)", "MLP (2-Layer)", "TabNet (Attentive)"],
    "ensemble": "Calibrated Performance-Weighted"
  }
}
```
