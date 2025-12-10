# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install MongoDB as a Service (check the option)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   net start MongoDB
   ```

5. **Check if MongoDB is running**
   ```powershell
   Get-Service MongoDB
   ```

---

## Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

If you don't want to install MongoDB locally, use MongoDB Atlas:

### Setup Steps:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster**
   - Choose "Free Shared" tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: `Admin@123` (or create your own)
   - Set privileges to "Read and Write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your current IP address

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

   Example:
   ```
   mongodb+srv://admin:Admin@123@cluster0.xxxxx.mongodb.net/sports-booking?retryWrites=true&w=majority
   ```

6. **Update Backend .env File**
   ```env
   MONGODB_URI=mongodb+srv://admin:Admin@123@cluster0.xxxxx.mongodb.net/sports-booking?retryWrites=true&w=majority
   ```

---

## Option 3: Quick Docker Setup (If Docker is Installed)

```powershell
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop MongoDB
docker stop mongodb

# Start MongoDB again
docker start mongodb
```

---

## Current Project Status

Your backend is configured to use:
```
mongodb://localhost:27017/sports-booking
```

**To fix the current error:**

### Quick Fix - Use MongoDB Atlas:

1. Create a MongoDB Atlas account (Option 2 above)
2. Get your connection string
3. Update `backend/.env`:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```
4. Backend will automatically reconnect

### OR Install MongoDB Locally:

1. Follow Option 1 installation steps
2. Keep the current connection string
3. Backend will automatically connect when MongoDB starts

---

## Verify Connection

Once MongoDB is running (locally or Atlas), you should see:
```
MongoDB Connected: localhost (or cluster address)
Server running in development mode on port 5000
```

---

## Common Issues

### Issue: "connect ECONNREFUSED"
**Solution:** MongoDB is not running. Start the service or use Atlas.

### Issue: "Authentication failed"
**Solution:** Check username/password in connection string.

### Issue: "Network timeout"
**Solution:** Check firewall settings or Network Access in Atlas.

---

**Need Help?** 
- MongoDB Docs: https://docs.mongodb.com/
- Atlas Docs: https://docs.atlas.mongodb.com/
