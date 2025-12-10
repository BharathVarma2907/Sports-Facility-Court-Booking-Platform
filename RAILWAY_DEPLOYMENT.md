# Railway Deployment Guide - Backend

## Why Railway?
- ✅ Free $5 monthly credit
- ⚡ No cold starts (unlike Render)
- 🚀 Auto-deploy from GitHub
- 💾 Better than Render free tier

---

## Step 1: Prepare Backend for Railway

### 1.1 Create Railway Configuration
Already done! Your backend is ready.

### 1.2 Verify package.json
Make sure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## Step 2: Deploy on Railway

### 2.1 Sign Up
- Go to: https://railway.app/
- Sign in with GitHub

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
4. Click "Add variables" before deploying

### 2.3 Configure Service
1. In the project, click "Settings"
2. Set **Root Directory:** `backend`
3. Set **Start Command:** `npm start`
4. Set **Build Command:** `npm install`

### 2.4 Add Environment Variables
Click "Variables" tab and add:

```
MONGODB_URI=mongodb+srv://varmabharath046_db_user:mlrcdLDlLc1vZNhw@cluster0.unwcok1.mongodb.net/sports-booking?retryWrites=true&w=majority

JWT_ACCESS_SECRET=sports_booking_access_secret_key_2024_change_in_production

JWT_REFRESH_SECRET=sports_booking_refresh_secret_key_2024_change_in_production

JWT_ACCESS_EXPIRE=1h

JWT_REFRESH_EXPIRE=7d

NODE_ENV=production

ADMIN_EMAIL=admin@sportsbooking.com

ADMIN_PASSWORD=Admin@123

CLIENT_URL=https://your-frontend.vercel.app

PORT=5000
```

### 2.5 Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Railway will provide a URL like: `https://your-app.up.railway.app`

---

## Step 3: Get Your Backend URL

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" tab
4. Find "Domains" section
5. Click "Generate Domain"
6. Copy the URL: `https://sports-booking-backend.up.railway.app`

---

## Step 4: Update Frontend for Railway Backend

### 4.1 Update Frontend Environment Variable
In your `frontend/.env`:
```
VITE_API_URL=https://sports-booking-backend.up.railway.app/api
```

### 4.2 Deploy Frontend on Vercel
1. Go to: https://vercel.com/new
2. Import: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://sports-booking-backend.up.railway.app/api
   ```
5. Deploy!

---

## Step 5: Update CORS

### 5.1 After Frontend Deployed
1. Copy your Vercel frontend URL: `https://sports-booking.vercel.app`
2. Go back to Railway
3. Update `CLIENT_URL` variable with your Vercel URL
4. Railway will auto-redeploy

---

## Step 6: Seed Database

### Option A: Run Locally (Recommended)
```bash
cd backend
node seed.js
```

### Option B: Create Temporary Route
Add to `backend/server.js`:
```javascript
app.get('/api/seed', async (req, res) => {
  // Run seed logic here (only for first-time setup)
  res.json({ message: 'Database seeded' });
});
```

Visit: `https://your-app.up.railway.app/api/seed`
Then remove the route!

---

## Step 7: Test Deployment

### Test Backend:
Visit: `https://sports-booking-backend.up.railway.app/`
Expected: 
```json
{
  "success": true,
  "message": "Sports Court Booking API",
  "version": "1.0.0"
}
```

### Test Frontend:
Visit: `https://sports-booking.vercel.app`
- Landing page should load
- Login with: `admin@sportsbooking.com` / `Admin@123`
- Should redirect to Admin Dashboard

---

## Railway vs Render Comparison

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | $5/month credit | 750 hours/month |
| Cold Starts | ❌ None | ✅ 30-50s delay |
| Auto-Deploy | ✅ Yes | ✅ Yes |
| Setup | ⚡ Faster | 🐢 Slower |
| Best For | Backend APIs | Full-stack apps |

---

## Monitoring & Updates

### View Logs:
Railway Dashboard → Your Service → "Deployments" → Click latest → "View Logs"

### Update Code:
```bash
git add .
git commit -m "Update backend"
git push
```
Railway auto-deploys on push!

### Check Usage:
Railway Dashboard → Project → "Usage" tab
Monitor your $5 monthly credit

---

## Important Notes

1. **MongoDB Atlas:**
   - Make sure Network Access allows: `0.0.0.0/0`

2. **Environment Variables:**
   - Never commit `.env` files
   - Set all variables in Railway dashboard

3. **Auto-Deploy:**
   - Railway watches your `main` branch
   - Every push triggers auto-deploy

4. **Custom Domain (Optional):**
   - Railway supports custom domains
   - Go to Settings → Domains → Add custom domain

---

## Troubleshooting

### Build Fails:
- Check Railway logs
- Verify `package.json` scripts
- Ensure all dependencies listed

### Database Connection Error:
- Check MongoDB URI in variables
- Verify MongoDB Network Access (0.0.0.0/0)

### CORS Error:
- Update `CLIENT_URL` in Railway
- Match exactly with Vercel frontend URL
- Include protocol: `https://`

---

## Quick Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app/
- **Your GitHub Repo:** https://github.com/BharathVarma2907/Sports-Facility-Court-Booking-Platform

---

**Railway deployment ready! Follow steps above.** 🚀
