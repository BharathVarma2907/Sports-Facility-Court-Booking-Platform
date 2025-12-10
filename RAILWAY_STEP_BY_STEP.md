# Railway Deployment - Step by Step Guide (No Errors!)

## 🎯 Goal: Deploy Backend to Railway

---

## STEP 1: Railway Account Setup (1 minute)

1. Go to: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Authorize Railway to access your GitHub

✅ **Done!** Railway account ready.

---

## STEP 2: Create New Project (2 minutes)

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub Repo"**
3. Find your repo: **`BharathVarma2907/Sports-Facility-Court-Booking-Platform`**
4. Click **"Connect Repository"**
5. When asked about deploy: Click **"Deploy Now"** (don't worry about errors yet)

✅ **Project created!** (It will fail first, we'll fix it)

---

## STEP 3: Configure Build Settings (IMPORTANT!)

This is where most people get errors. Follow exactly:

### 3.1 Go to Settings

1. In Railway, click your project
2. You'll see: **"Services"** section
3. Click your service (it's named your repo)
4. Click **"Settings"** tab on the right

### 3.2 Set Build Command

Find: **"Build Command"** field
```
Leave EMPTY or set to:
npm install
```

### 3.3 Set Start Command

Find: **"Start Command"** field
```
npm start
```

### 3.4 Set Root Directory

Find: **"Root Directory"** field
```
/backend
```

**Screenshot showing where to find these:**
- Build Command: Under "Build" section
- Start Command: Under "Start" section  
- Root Directory: Usually at top

### 3.5 Save Settings

Click **"Save"** button (bottom right)

✅ **Build settings configured!**

---

## STEP 4: Add Environment Variables (CRITICAL!)

This is why most deployments fail! Missing variables.

### 4.1 Go to Variables

1. Still in your Railway service settings
2. Click **"Variables"** tab
3. Click **"Add Variable"**

### 4.2 Add Each Variable (One by one)

Copy-paste each:

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://varmabharath046_db_user:mlrcdLDlLc1vZNhw@cluster0.unwcok1.mongodb.net/sports-booking?retryWrites=true&w=majority`
- Click **"Add Variable"**

**Variable 2:**
- Key: `JWT_ACCESS_SECRET`
- Value: `sports_booking_access_secret_key_2024_change_in_production`
- Click **"Add Variable"**

**Variable 3:**
- Key: `JWT_REFRESH_SECRET`
- Value: `sports_booking_refresh_secret_key_2024_change_in_production`
- Click **"Add Variable"**

**Variable 4:**
- Key: `JWT_ACCESS_EXPIRE`
- Value: `1h`
- Click **"Add Variable"**

**Variable 5:**
- Key: `JWT_REFRESH_EXPIRE`
- Value: `7d`
- Click **"Add Variable"**

**Variable 6:**
- Key: `NODE_ENV`
- Value: `production`
- Click **"Add Variable"**

**Variable 7:**
- Key: `ADMIN_EMAIL`
- Value: `admin@sportsbooking.com`
- Click **"Add Variable"**

**Variable 8:**
- Key: `ADMIN_PASSWORD`
- Value: `Admin@123`
- Click **"Add Variable"**

**Variable 9:**
- Key: `PORT`
- Value: `5000`
- Click **"Add Variable"**

**Variable 10:**
- Key: `CLIENT_URL`
- Value: `https://your-frontend.vercel.app`
- (Keep this as placeholder, we'll update later)
- Click **"Add Variable"**

✅ **All variables added!**

---

## STEP 5: Deploy (Trigger Build)

Now the magic happens!

1. Go to **"Deployments"** tab
2. You'll see your previous failed deployment
3. Click the **three dots (...)** next to it
4. Click **"Redeploy"**

Railway will now:
- Pull latest code from GitHub
- Install dependencies (`npm install`)
- Start server (`npm start`)
- Give you a live URL

⏳ **Wait 3-5 minutes...**

---

## STEP 6: Check if Deployment Succeeded

### 6.1 Watch the Logs

1. In **Deployments** tab
2. Click on the **latest deployment** (should say "Building..." then "Success")
3. Click **"View Logs"** to see what's happening
4. Look for message: `Server running in production mode on port 5000`

### 6.2 Get Your Railway URL

When deployment succeeds:
1. Go to **"Settings"** tab
2. Scroll down to **"Domains"** section
3. Click **"Generate Domain"**
4. Copy the URL (example: `https://sports-booking-api.up.railway.app`)

✅ **Backend is LIVE!** 🎉

---

## STEP 7: Test Backend is Working

1. Open a new browser tab
2. Paste your Railway URL: `https://sports-booking-api.up.railway.app/`
3. You should see:
```json
{
  "success": true,
  "message": "Sports Court Booking API",
  "version": "1.0.0"
}
```

If you see this JSON → **Your backend is working!** ✅

If you see error → Check logs (next section)

---

## 🔧 TROUBLESHOOTING - Common Errors

### Error 1: "Build failed"

**What it looks like:**
- Red "X" mark
- Says "Build failed"

**Check logs:**
1. Click the failed deployment
2. Click "View Logs"
3. Look for red error text

**Common causes & fixes:**

**Cause:** Missing environment variables
```
Error: Cannot find module 'dotenv'
```
**Fix:** You already have them set, might be a typo. Check MONGODB_URI format.

**Cause:** Wrong root directory
```
Error: ENOENT: no such file
```
**Fix:** Make sure Root Directory is `/backend` (with forward slash)

**Cause:** MongoDB connection error
```
Error: connect ECONNREFUSED
```
**Fix:** 
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Network Access"
3. Make sure IP `0.0.0.0/0` is whitelisted
4. Redeploy Railway

---

### Error 2: "Script start.sh not found"

**What it looks like:**
```
Script start.sh not found
```

**Fix:**
1. Set Start Command in Railway Settings to: `npm start`
2. Don't use `./start.sh`
3. Redeploy

---

### Error 3: "Port already in use"

**What it looks like:**
```
Error: listen EADDRINUSE
```

**Fix:**
1. Set PORT variable to `5000`
2. Or use `PORT=${PORT:-5000}` in start command
3. Redeploy

---

### Error 4: Still getting errors?

**Nuclear Option - Start Fresh:**

1. Delete the service in Railway (Settings → Delete Service)
2. Create new project again
3. Follow steps 1-6 exactly
4. Check logs carefully for exact error message
5. Google the error message + "Railway"

---

## 📱 Next Step: Connect Frontend

Once backend is working:

1. Copy your Railway URL: `https://your-api.up.railway.app`
2. Go to Vercel
3. Update environment variable:
   ```
   VITE_API_URL=https://your-api.up.railway.app/api
   ```
4. Redeploy Vercel

✅ **Frontend + Backend connected!**

---

## ✅ Verification Checklist

After deployment:
- [ ] Railway deployment shows "Success" ✅
- [ ] Can visit your Railway URL
- [ ] See JSON response at `/`
- [ ] No red error marks in logs
- [ ] MongoDB connection successful (check logs)
- [ ] Can access API endpoints

**If all checked: You're done!** 🚀

---

## 🆘 Still Stuck?

1. **Check exact error in logs**
2. **Google the error message**
3. **Search Railway docs:** https://docs.railway.app/
4. **Check MongoDB Atlas:** https://cloud.mongodb.com/

**Most common issue: Missing MONGODB_URI variable**
- Copy exactly from MongoDB Atlas
- Make sure `0.0.0.0/0` is whitelisted

---

**Railway Deployment = ✅ Complete!**

Next: Deploy Frontend on Vercel → Done! 🎉
