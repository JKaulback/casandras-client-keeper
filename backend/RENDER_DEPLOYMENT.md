# Render Deployment Guide for Casandra's Client Keeper Backend

## Why Render?
- ✅ **Free forever** (with spin-down after 15 min inactivity)
- ✅ **Simple setup** - no complex configuration
- ✅ **Auto-deploy** from GitHub
- ✅ **No credit card required** for free tier
- ✅ **No student email dependency**

## Prerequisites
- GitHub account with your code pushed
- Render account (sign up at https://render.com)

## Step 1: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your repositories

## Step 2: Create a New Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your repository:
   - If not connected, click **"Configure account"** → select repositories
   - Find and select **"casandras-client-keeper"**
3. Click **"Connect"**

## Step 3: Configure the Web Service

Fill in these settings:

- **Name**: `casandras-backend` (or your preferred name)
- **Region**: Choose closest to you (Oregon, Frankfurt, Singapore, Ohio)
- **Branch**: `master`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

## Step 4: Add Environment Variables

Before deploying, scroll down to **"Environment Variables"** and add:

```
Key: MONGODB_URI
Value: mongodb+srv://casandras-app:***REMOVED***@personal-cluster-0.6fufnfa.mongodb.net/casandras-client-keeper

Key: NODE_ENV
Value: production

Key: FRONTEND_URL
Value: (leave empty for now, add your React Native/Expo URL later)
```

## Step 5: Deploy!

1. Click **"Create Web Service"** at the bottom
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
   - Give you a URL like: `https://casandras-backend.onrender.com`

## Step 6: Verify Deployment

1. Wait for build to complete (watch the logs)
2. When you see **"Live"** badge, click your service URL
3. You should see: `{"message":"Welcome to Casandra's Client Keeper API"}`

## Important: Update MongoDB Atlas

Your MongoDB needs to allow connections from Render:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Safe because your connection string requires authentication
5. Confirm

## Auto-Deploy Setup

✅ **Already configured!** Every time you push to GitHub, Render automatically deploys.

To disable:
1. Go to your service settings
2. Find **"Auto-Deploy"**
3. Toggle off (not recommended)

## Managing Your Service

### View Logs:
- Click **"Logs"** tab to see real-time application logs

### Restart Service:
- Click **"Manual Deploy"** → **"Clear build cache & deploy"**

### Update Environment Variables:
- Go to **"Environment"** tab
- Edit variables
- Service auto-restarts

## Important Notes About Free Tier

⚠️ **Spin-Down**: Service sleeps after 15 minutes of inactivity
- First request after sleep takes **30-60 seconds** to wake up
- Subsequent requests are instant
- This is normal for free tier

💡 **For demos**: Load your API URL 30 seconds before showing your app

**Monthly Limits**:
- 750 hours/month (one service can run 24/7)
- No bandwidth limits on free tier

## Update CORS for Production

Once deployed, update your frontend to use the Render URL:

In your React Native app:
```javascript
const API_URL = 'https://casandras-backend.onrender.com';
```

Then update `FRONTEND_URL` environment variable in Render with your frontend URL.

## Testing Your API

Your API endpoints:
```
Base URL: https://casandras-backend.onrender.com

GET  /                  # Welcome message
POST /api/customers     # Your future endpoints
GET  /api/dogs          # etc.
```

## Troubleshooting

**Build Failed:**
- Check logs for errors
- Verify `package.json` has all dependencies
- Make sure `start` script exists

**Application Error:**
- Check **Logs** tab
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows Render IPs (0.0.0.0/0)

**Slow First Load:**
- Normal! Free tier spins down after inactivity
- Paid tier ($7/month) stays always-on

**Can't Connect to MongoDB:**
- Verify Network Access in MongoDB Atlas
- Check connection string includes database name
- Test connection string locally first

## Upgrading (Optional)

**Paid tier benefits** ($7/month):
- No spin-down (always-on)
- Better performance
- More memory/CPU

But **free tier is perfect** for school projects and portfolios!

## Your URLs

After deployment, save these:
- **Service URL**: https://casandras-backend.onrender.com (or your custom name)
- **Dashboard**: https://dashboard.render.com

## Cost

💰 **$0 forever!** No credit card required, no surprises.

Perfect for students and personal projects! 🎉
