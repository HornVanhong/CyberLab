# 🚀 How to Deploy Laravel API → Render → PostgreSQL

This guide provides step-by-step instructions to deploy your **Laravel REST API** connected to a managed **PostgreSQL Database** on **Render** for free!

---

## 🎯 Architecture Stack
* **Framework**: Laravel 11 / PHP 8.2 API
* **Database**: Render Managed PostgreSQL (`cyberlab_db`)
* **Host**: Render Web Service (Docker container deployment via `render.yaml`)

---

## 📋 1-Click Render Deployment Instructions

### Step 1: Push your Code to GitHub
Push this repository containing the `backend-laravel/` directory to GitHub:
```bash
git add .
git commit -m "Add Laravel PostgreSQL backend for Render deployment"
git push origin main
```

---

### Step 2: Create a Blueprint Instance on Render
1. Log into your **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** in the top right -> Select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/HornVanhong/CyberLab.git`.
4. Render will automatically detect `render.yaml` inside `backend-laravel/`.
5. Render will automatically provision:
   * 🐘 **PostgreSQL Database** (`cyberlab-postgres`)
   * 🌐 **Laravel Web Service** (`cyberlab-laravel-api`)
6. Click **Apply**.

---

### Step 3: Database Auto-Migration
During deployment, Render automatically executes:
```bash
php artisan migrate --force
```
This automatically builds the `users`, `progress`, `submissions`, and `certificates` tables inside your live Render PostgreSQL database!

---

## 📡 Live API Endpoint URLs

Once deployed, your live API endpoints will be accessible at:
* `GET https://<your-render-app>.onrender.com/api/auth/me`
* `POST https://<your-render-app>.onrender.com/api/auth/login`
* `POST https://<your-render-app>.onrender.com/api/auth/register`
* `POST https://<your-render-app>.onrender.com/api/flags/submit`
* `GET https://<your-render-app>.onrender.com/api/health`

---

## ⚙️ Connecting Next.js Frontend to Render API

In your Next.js `next.config.ts` or `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://<your-render-app>.onrender.com/api
```
