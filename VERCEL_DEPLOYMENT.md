# Vercel Deployment Guide - Frontend Only

## Strategy: 
- **Backend:** Deploy on Render (Free tier with always-on)
- **Frontend:** Deploy on Vercel (Fast CDN, perfect for React)

---

## Step 1: Deploy Backend on Render

### 1.1 Go to Render Dashboard
- Visit: https://render.com/
- Sign in with GitHub

### 1.2 Create New Web Service
- Click "New +" → "Web Service"
- Connect your repository: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
- Configure:
  - **Name:** `sports-booking-api`
  - **Root Directory:** `backend`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Plan:** Free

### 1.3 Add Environment Variables
Click "Environment" and add:
```
MONGODB_URI=mongodb+srv://varmabharath046_db_user:mlrcdLDlLc1vZNhw@cluster0.unwcok1.mongodb.net/sports-booking?retryWrites=true&w=majority
JWT_ACCESS_SECRET=sports_booking_access_secret_key_2024_change_in_production
JWT_REFRESH_SECRET=sports_booking_refresh_secret_key_2024_change_in_production
JWT_ACCESS_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
NODE_ENV=production
ADMIN_EMAIL=admin@sportsbooking.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=https://your-frontend-name.vercel.app
PORT=5000
```

### 1.4 Deploy
- Click "Create Web Service"
- Wait for deployment (3-5 minutes)
- Copy your backend URL: `https://sports-booking-api.onrender.com`

---

## Step 2: Deploy Frontend on Vercel

### 2.1 Go to Vercel Dashboard
- Visit: https://vercel.com/
- Sign in with GitHub

### 2.2 Import Project
- Click "Add New" → "Project"
- Import: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
- Configure:
  - **Framework Preset:** Vite
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`

### 2.3 Add Environment Variable
Click "Environment Variables" and add:
```
VITE_API_URL=https://sports-booking-api.onrender.com/api
```
(Replace with your actual Render backend URL)

### 2.4 Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)
- Copy your frontend URL: `https://sports-booking-platform.vercel.app`

---

## Step 3: Update Backend CORS

### 3.1 Update Backend Environment on Render
- Go back to Render dashboard
- Open your backend service
- Environment → Edit `CLIENT_URL`
- Set to your Vercel frontend URL: `https://sports-booking-platform.vercel.app`
- Click "Save Changes" (auto redeploys)

---

## Step 4: Seed Database (One-time)

Run locally or create a temporary route:
```bash
cd backend
node seed.js
```

This creates:
- Admin user
- 20 sample courts
- Coaches
- Equipment
- Pricing rules

---

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://sports-booking-api.onrender.com/`
Should see: `{"success":true,"message":"Sports Court Booking API","version":"1.0.0"}`

### 5.2 Test Frontend
Visit: `https://sports-booking-platform.vercel.app`
Should see: Landing page with Login/Signup buttons

### 5.3 Test Full Flow
1. Click "Login"
2. Use credentials: `admin@sportsbooking.com` / `Admin@123`
3. Should redirect to Admin Dashboard

---

## Quick Commands for Updates

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push!

### Update Backend:
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys on push!

---

## Important URLs

- **Frontend (Vercel):** https://your-app.vercel.app
- **Backend (Render):** https://your-api.onrender.com
- **GitHub Repo:** https://github.com/BharathVarma2907/Sports-Facility-Court-Booking-Platform
- **MongoDB Atlas:** https://cloud.mongodb.com/

---

## Troubleshooting

### Backend Issues:
- Check Render logs
- Verify MongoDB connection (Network Access: 0.0.0.0/0)
- Check environment variables

### Frontend Issues:
- Check Vercel build logs
- Verify VITE_API_URL is correct
- Test API endpoint in browser

### CORS Errors:
- Make sure CLIENT_URL in Render matches Vercel URL exactly
- Check backend CORS configuration

---

## Free Tier Limitations

### Render (Backend):
- ✅ Free
- ⏰ Spins down after 15 mins of inactivity
- ⏱️ First request after sleep takes 30-50 seconds
- 💾 500MB RAM

### Vercel (Frontend):
- ✅ Free
- ⚡ Always fast (CDN)
- 🚀 Unlimited bandwidth
- 📦 100GB bandwidth/month

### Solution for Render Sleep:
Add a cron job or uptime monitor to ping your API every 10 minutes:
- Use: https://uptimerobot.com/ (free)
- Ping URL: `https://your-api.onrender.com/`

---

**Ready to deploy! Follow the steps above.** 🚀

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
4. Configure Project:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`

5. Add Environment Variables (Settings → Environment Variables):
   - Add all variables from above
   - Make sure to select "Production", "Preview", and "Development" for each variable

6. Click "Deploy"

### 3. Deploy via CLI (Alternative)
```bash
cd "C:\Users\varma\OneDrive\Desktop\projects\Sports Facility Court Booking Platform"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **sports-court-booking**
- In which directory is your code located? **.**
- Override settings? **Y**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Development Command: Leave empty

Then run:
```bash
vercel --prod
```

---

## Post-Deployment:

### 1. Update MongoDB Network Access
- Go to MongoDB Atlas
- Network Access → Add IP Address
- Add `0.0.0.0/0` (Allow from anywhere)

### 2. Run Seed Script (One-time)
Create a seed route or run locally:
```bash
cd backend
node seed.js
```

### 3. Test the Deployment
- Visit your Vercel URL
- Test login with admin credentials
- Create a test booking

---

## Important Notes:

1. **Serverless Functions Limitation:**
   - Vercel serverless functions have 10s timeout on Hobby plan
   - For long-running processes, consider upgrading

2. **Environment Variables:**
   - Never commit `.env` files
   - Always set them in Vercel dashboard

3. **Database:**
   - MongoDB Atlas must allow connections from anywhere (0.0.0.0/0)
   - Or add Vercel's IP ranges

4. **CORS:**
   - Update CLIENT_URL in backend after deployment
   - Frontend VITE_API_URL should point to production API

---

## Troubleshooting:

### Build Fails:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure MongoDB connection string is correct

### API Not Working:
- Check environment variables are set
- Verify MongoDB network access
- Check serverless function logs

### Frontend Not Loading:
- Verify build output directory is `frontend/dist`
- Check if `npm run build` works locally
- Ensure VITE_API_URL is set correctly
