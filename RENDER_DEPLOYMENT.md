# Render Deployment - Step by Step (Free Tier!)

## 🎯 Why Render over Railway?

- ✅ **750 hours/month free** (enough for backend always-on)
- ✅ **No credit card needed**
- ✅ **Easy setup**
- ✅ **Auto-deploy from GitHub**
- ⚠️ Cold start after 15 mins (first request = 30-50s wait)

---

## STEP 1: Create Render Account (1 minute)

1. Go to: **https://render.com/**
2. Click **"Sign up"**
3. Choose **"GitHub"** (recommended)
4. Authorize Render

✅ **Account ready!**

---

## STEP 2: Create Web Service (2 minutes)

1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
5. Click **"Connect"**

---

## STEP 3: Configure Service (IMPORTANT!)

This is the key part. Follow exactly:

### 3.1 Basic Settings

**Name:**
```
sports-booking-api
```

**Environment:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### 3.2 Root Directory

Find **"Root Directory"** field and set:
```
backend
```

### 3.3 Plan

Select:
```
Free
```

✅ **Settings configured!**

---

## STEP 4: Add Environment Variables

### 4.1 Click "Add Environment Variable"

Add each one:

```
MONGODB_URI=mongodb+srv://varmabharath046_db_user:mlrcdLDlLc1vZNhw@cluster0.unwcok1.mongodb.net/sports-booking?retryWrites=true&w=majority

JWT_ACCESS_SECRET=sports_booking_access_secret_key_2024_change_in_production

JWT_REFRESH_SECRET=sports_booking_refresh_secret_key_2024_change_in_production

JWT_ACCESS_EXPIRE=1h

JWT_REFRESH_EXPIRE=7d

NODE_ENV=production

ADMIN_EMAIL=admin@sportsbooking.com

ADMIN_PASSWORD=Admin@123

PORT=5000

CLIENT_URL=https://your-frontend.vercel.app
```

✅ **All variables added!**

---

## STEP 5: Deploy!

1. Click **"Create Web Service"**
2. Render will start building...
3. Wait 3-5 minutes

You'll see:
- "Building..." → Installing dependencies
- "Deploying..." → Starting server
- "Live" ✅ → Success!

---

## STEP 6: Get Your Render URL

1. Go to your service page
2. At top, you'll see URL like:
```
https://sports-booking-api.onrender.com
```

Copy this URL! You need it for frontend.

✅ **Backend is LIVE!**

---

## STEP 7: Test Backend

1. Open browser tab
2. Paste: `https://sports-booking-api.onrender.com/`
3. You should see:
```json
{
  "success": true,
  "message": "Sports Court Booking API",
  "version": "1.0.0"
}
```

If you see this → **Backend works!** ✅

---

## STEP 8: Handle Cold Starts (Optional but Recommended)

Free tier Render spins down after 15 mins of no activity.
First request after spin-down = 30-50 second wait.

### Solution: Use UptimeRobot (keeps it alive)

1. Go to: **https://uptimerobot.com/**
2. Sign up free
3. Add new monitor:
   - **Type:** HTTPS
   - **URL:** `https://your-render-url.onrender.com/`
   - **Interval:** 5 minutes
4. Save

Now Render will stay alive 24/7! ✅

---

## 🎉 SUCCESS - Backend Ready!

Your Render URL:
```
https://sports-booking-api.onrender.com
```

---

## NEXT: Deploy Frontend on Vercel

1. Go to: **https://vercel.com/new**
2. Import: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
3. Root Directory: `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://sports-booking-api.onrender.com/api
   ```
5. Deploy!

---

## ✅ Verification

After both deployed:
- [ ] Render backend shows "Live" ✅
- [ ] Can visit Render URL in browser
- [ ] See JSON response ✅
- [ ] Vercel frontend deploys successfully ✅
- [ ] Frontend can reach backend API ✅

---

## 🆘 Troubleshooting

### Build Failed

**Check logs:**
1. Go to your Render service
2. Click "Logs" tab
3. Look for red error text

**Common causes:**
- Wrong root directory (should be `backend`)
- Missing environment variable
- Typo in MONGODB_URI

**Fix:** Update settings and click "Deploy" again

---

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Fix:**
1. Go MongoDB Atlas: https://cloud.mongodb.com/
2. Network Access → Add IP Address
3. Select "Allow access from anywhere" (0.0.0.0/0)
4. Redeploy Render

---

### Still not working?

1. Check exact error in logs
2. Make sure MONGODB_URI is exact copy from MongoDB Atlas
3. Make sure all 10 environment variables are set
4. Try redeploying service

---

## 📊 Render Free Tier Limits

- **750 hours/month** = always-on (24×30 = 720)
- **Cold starts** after 15 min inactivity = 30-50s
- **1 free web service** at a time
- **No credit card** needed

**Perfect for development!**

---

## 🚀 Full Stack Deployed!

- ✅ **Backend:** Render (free tier)
- ✅ **Frontend:** Vercel (free tier)
- ✅ **Database:** MongoDB Atlas (free tier)
- ✅ **Auto-deploy:** On git push
- ✅ **Always-on:** UptimeRobot (optional)

**Your app is production-ready!** 🎉

---

**Next Steps:**
1. Follow this guide to deploy on Render
2. Update VITE_API_URL in Vercel
3. Test the full application
4. Share your live URL!

---

**Happy Deploying!** 🚀
