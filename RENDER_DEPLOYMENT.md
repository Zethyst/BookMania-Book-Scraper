# 🚀 Render Deployment Guide (Fixed Playwright Issue)

## ✅ Solution for Playwright Installation Error

The error occurs because `npx playwright install --with-deps` tries to use `su` to install system dependencies, which fails on Render.

### Option 1: Use Dockerfile (Recommended)

Render supports Dockerfile deployment. This is the cleanest solution.

**Steps:**

1. **Ensure Dockerfile exists** in `backend/` directory (already updated ✅)

2. **In Render Dashboard:**
   - Go to your Web Service
   - **Settings** → **Build & Deploy**
   - **Dockerfile Path**: `backend/Dockerfile` (or leave empty if Dockerfile is in root)
   - **Docker Context**: `backend` (if Dockerfile is in backend folder)

3. **Build Command**: Leave empty (Dockerfile handles it)

4. **Start Command**: Leave empty (Dockerfile CMD handles it)

5. **Environment Variables** (same as before):
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://... (from Render dashboard)
   REDIS_URL=rediss://... (from Render dashboard)
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### Option 2: Native Build (Without Docker)

If you prefer native build without Docker:

**Build Command:**
```bash
npm install --legacy-peer-deps && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Important**: You'll need to install Chromium separately. Add this to **Build Command**:
```bash
npm install --legacy-peer-deps && npx playwright install chromium --with-deps || npx playwright install chromium
```

**OR** use system Chromium by setting environment variable:
```env
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

### Option 3: Pre-install Script (Best for Native Build)

Create `backend/scripts/install-playwright.sh`:

```bash
#!/bin/bash
set -e

echo "Installing Playwright browsers..."

# Skip browser download if system Chromium is available
if command -v chromium-browser &> /dev/null; then
    echo "System Chromium found, skipping browser download"
    export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
    export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
else
    echo "Installing Playwright browsers..."
    npx playwright install chromium || true
    # If install fails, continue anyway (we'll handle it at runtime)
fi

echo "Playwright setup complete"
```

**Build Command:**
```bash
npm install --legacy-peer-deps && chmod +x scripts/install-playwright.sh && ./scripts/install-playwright.sh && npm run build
```

---

## 🎯 Recommended Setup for Render

### Using Dockerfile (Easiest)

1. **Create Web Service** in Render
2. **Connect GitHub Repository**
3. **Settings**:
   - **Name**: `books-scraper-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (or leave empty)
   - **Docker Context**: `backend`
   - **Build Command**: (leave empty)
   - **Start Command**: (leave empty)

4. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   REDIS_URL=rediss://default:pass@host:6379
   FRONTEND_URL=https://your-app.vercel.app
   SCRAPER_TIMEOUT=180000
   SCRAPER_MAX_CONCURRENCY=1
   ```

5. **Advanced Settings**:
   - **Health Check Path**: `/api/v1/products?page=1&limit=1`
   - **Auto-Deploy**: Yes

### Using Native Build (Alternative)

1. **Create Web Service** in Render
2. **Settings**:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install --legacy-peer-deps && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx playwright install chromium && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm run start:prod
     ```

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://...
   REDIS_URL=rediss://...
   FRONTEND_URL=https://...
   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
   ```

---

## 🔧 Troubleshooting

### Error: "su: Authentication failure"

**Cause**: Playwright trying to install system deps with `su`

**Solution**: 
- Use Dockerfile (Option 1) ✅
- OR skip browser download: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`
- OR install without deps: `npx playwright install chromium` (without `--with-deps`)

### Error: "Chromium not found"

**Solution**: Set environment variable:
```env
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Error: "Build timeout"

**Cause**: Playwright browser download takes too long

**Solution**: 
- Use Dockerfile (browsers pre-installed)
- OR use system Chromium
- OR upgrade Render plan (longer build timeout)

### Error: "Memory limit exceeded"

**Cause**: Playwright uses ~500MB RAM

**Solution**: Upgrade to Render Starter plan ($7/month)

---

## ✅ Quick Fix Summary

**For immediate deployment, use Dockerfile approach:**

1. Render Dashboard → Your Service → Settings
2. Change **Environment** to `Docker`
3. Set **Dockerfile Path** to `backend/Dockerfile`
4. Remove Build Command (Dockerfile handles it)
5. Deploy ✅

The Dockerfile already:
- ✅ Installs system Chromium
- ✅ Sets environment variables
- ✅ Skips browser download
- ✅ Uses system browser

No more `su` authentication errors! 🎉
