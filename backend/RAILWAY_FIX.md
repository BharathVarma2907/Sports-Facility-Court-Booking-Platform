# Railway Backend Configuration

## Fix for Railway Build Error

The error shows:
- ✅ Dependencies installed
- ❌ Start script not found
- ❌ Railpack couldn't determine how to build

### Solution:

**Railway Dashboard Settings:**

1. Go to your **Backend Service** in Railway
2. Click **"Settings"** tab
3. Set these exactly:

**Build:**
```
Build Command: npm install
```

**Start:**
```
Start Command: npm start
```

**Root Directory:**
```
/backend
```

4. Make sure these environment variables are set:
```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=5000
(and all others)
```

5. Click **"Redeploy"** or go to Deployments → Click latest → **"Redeploy"**

---

## If Still Failing:

### Check Logs:
1. Deployments tab
2. Click the failed deployment
3. Click "View Logs"
4. Look for error message

### Common Issues:

**Issue:** `npm: not found`
- **Solution:** Railway should auto-detect Node. Try redeploying.

**Issue:** `MongoDB connection error`
- **Solution:** Check MONGODB_URI variable. Add 0.0.0.0/0 to MongoDB Atlas network access.

**Issue:** `Port already in use`
- **Solution:** Set PORT=5000 in variables

---

## Restart Deployment:

1. Go to Railway dashboard
2. Click your Backend service
3. Deployments tab
4. Click latest failed deployment
5. Click "Redeploy" button

Wait 2-3 minutes for rebuild.

---

**After fixed, you'll get a working Railway URL!** ✅
