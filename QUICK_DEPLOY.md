# Vercel + Railway Full Deployment Guide

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Deploy Backend on Railway

1. Go to: **https://railway.app/**
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select: `BharathVarma2907/Sports-Facility-Court-Booking-Platform`
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
5. Click **"Add Variables"** and add:

```
MONGODB_URI=mongodb+srv://varmabharath046_db_user:mlrcdLDlLc1vZNhw@cluster0.unwcok1.mongodb.net/sports-booking?retryWrites=true&w=majority
JWT_ACCESS_SECRET=sports_booking_access_secret_key_2024_change_in_production
JWT_REFRESH_SECRET=sports_booking_refresh_secret_key_2024_change_in_production
JWT_ACCESS_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
NODE_ENV=production
ADMIN_EMAIL=admin@sportsbooking.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=https://your-vercel-app.vercel.app
PORT=5000
```

6. Click **"Deploy"**
7. Wait 2-3 minutes → Copy your Railway URL (example: `https://sports-booking-api.up.railway.app`)

---

### Step 2: Deploy Frontend on Vercel

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste: `https://github.com/BharathVarma2907/Sports-Facility-Court-Booking-Platform`
4. Click **"Continue"**
5. Configure:
   - **Framework Preset:** Select **"React"**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (should be default)
   - **Output Directory:** `dist` (should be default)
6. Click **"Environment Variables"** and add:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   ```
   (Replace with your actual Railway URL from Step 1)
7. Click **"Deploy"**
8. Wait 3-5 minutes → Copy your Vercel URL (example: `https://sports-booking.vercel.app`)

---

### Step 3: Update Backend CORS

1. Go back to **Railway Dashboard**
2. Click your **Backend Service**
3. Go to **"Variables"** tab
4. Update: `CLIENT_URL=https://your-vercel-url.vercel.app`
5. Railway will auto-redeploy ✅

---

### Step 4: Test Everything

**Test Backend:**
Visit: `https://your-railway-backend.up.railway.app/`
You should see:
```json
{
  "success": true,
  "message": "Sports Court Booking API",
  "version": "1.0.0"
}
```

**Test Frontend:**
Visit: `https://your-vercel-app.vercel.app`
1. See Landing page with Login/Signup buttons ✅
2. Click Login
3. Use credentials:
   - Email: `admin@sportsbooking.com`
   - Password: `Admin@123`
4. Should redirect to Admin Dashboard ✅

---

## 📝 Detailed Steps with Screenshots

### Vercel Step-by-Step

**Screenshot Guide:**
1. Framework Preset: Select **"React"** (not "React Router" or others shown)
2. Root Directory: Must be **`frontend`** (important!)
3. Build Command: Keep default **`npm run build`**
4. Output Directory: Keep default **`dist`**
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: Your Railway backend URL + `/api`
   - Example: `https://sports-booking-api.up.railway.app/api`

**What happens after you click "Deploy":**
- Vercel clones your repo
- Installs dependencies (`npm install`)
- Builds the app (`npm run build`)
- Uploads to CDN
- You get a live URL in 3-5 minutes

---

## 🔧 If Something Goes Wrong

### Build Fails on Vercel:
1. Check build logs (Deployments tab)
2. Common issues:
   - Missing environment variable: `VITE_API_URL`
   - Wrong root directory (should be `frontend`)
   - Dependencies missing in `package.json`

**Solution:**
- Go to **Settings** → **Environment Variables**
- Add/fix `VITE_API_URL`
- Click **"Redeploy"**

### API Calls Failing:
1. Check browser console (F12)
2. Verify `VITE_API_URL` is set correctly
3. Verify Railway backend is running
4. Check CORS: `CLIENT_URL` in Railway must match Vercel URL exactly

**Solution:**
- Update `CLIENT_URL` in Railway
- Railway will auto-redeploy
- Wait 1-2 minutes for CORS to work

### Can't Login:
1. Check if backend is running: Visit your Railway URL
2. Check MongoDB connection in Railway logs
3. Verify all environment variables are set

**Solution:**
- Go to Railway dashboard
- Click your service → Deployments
- Check logs for MongoDB errors

---

## 📊 Deployment Comparison

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Best For** | Backend APIs | Frontend React apps |
| **Free Tier** | $5/month credit | Unlimited |
| **Cold Starts** | None ⚡ | None ⚡ |
| **Setup Time** | 3 minutes | 2 minutes |
| **Auto-Deploy** | On git push ✅ | On git push ✅ |
| **Custom Domain** | ✅ | ✅ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🔐 Important Security Notes

1. **Never commit `.env` files** to GitHub
2. **All secrets go in provider dashboards:**
   - Railway Variables tab
   - Vercel Environment Variables
3. **MongoDB Network Access:**
   - Must be `0.0.0.0/0` (allow anywhere)
   - Or whitelist Railway IP (complex)

---

## 📱 Testing Your App

### Desktop Browser:
1. Visit: `https://your-app.vercel.app`
2. Try landing page
3. Try login/signup
4. Try booking

### Mobile Browser:
- Responsive design tested ✅
- Touch-friendly buttons ✅
- Fast loading on 4G ✅

---

## 🚀 What's Live Now

- ✅ **Frontend:** Vercel (CDN, blazing fast)
- ✅ **Backend:** Railway (no cold starts)
- ✅ **Database:** MongoDB Atlas (cloud)
- ✅ **Authentication:** JWT tokens
- ✅ **Dynamic Pricing:** Working
- ✅ **Availability Checking:** Real-time
- ✅ **Admin Dashboard:** Full CRUD

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **Your GitHub:** https://github.com/BharathVarma2907/Sports-Facility-Court-Booking-Platform
- **MongoDB Docs:** https://docs.mongodb.com/

---

## ✨ Success Checklist

After deployment, verify:
- [ ] Frontend loads at Vercel URL
- [ ] Landing page displays
- [ ] Login button works
- [ ] Can login with admin credentials
- [ ] Admin dashboard loads
- [ ] Courts list displays (20 courts)
- [ ] Can create booking
- [ ] Price breakdown calculates
- [ ] Can view bookings history
- [ ] Logout works

**If all checked: Your app is production-ready! 🎉**

---

**Deploy now: https://vercel.com/new** 🚀
