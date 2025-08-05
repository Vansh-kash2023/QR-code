# 🚀 Deploy Faculty Availability System to Render

This guide will help you deploy your QR-enabled Faculty Availability System to Render with both backend and frontend.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Code Ready**: Your project is working locally

## 🎯 Deployment Strategy

We'll deploy this as:
- **Backend**: Node.js Web Service on Render
- **Frontend**: Static Site on Render
- **Database**: SQLite (file-based, included in backend)

## 📚 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify Files**: Ensure these deployment files are in your repo:
   - ✅ `Procfile`
   - ✅ `render.yaml`
   - ✅ `.env.production`
   - ✅ `client/.env.production`

### Step 2: Deploy Backend (Node.js Service)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: 
   - Connect your GitHub account
   - Select your `QR-code` repository
4. **Configure Service**:
   ```
   Name: faculty-availability-backend
   Environment: Node
   Region: Oregon (US West) or your preferred
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
   PORT=10000
   CLIENT_URL=https://your-frontend-name.onrender.com
   ```

6. **Advanced Settings**:
   - Health Check Path: `/api/health`
   - Plan: Free (or paid if you prefer)

7. **Click "Create Web Service"**

### Step 3: Deploy Frontend (Static Site)

1. **In Render Dashboard**, click "New +" → **"Static Site"**
2. **Connect Same Repository**
3. **Configure Static Site**:
   ```
   Name: faculty-availability-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-name.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend-name.onrender.com
   REACT_APP_QR_BASE_URL=https://your-frontend-name.onrender.com/check
   ```

5. **Add Redirects/Rewrites**:
   - Create `client/public/_redirects` file:
   ```
   /*    /index.html   200
   ```

6. **Click "Create Static Site"**

### Step 4: Update Environment Variables

After both services are created:

1. **Get Your URLs**:
   - Backend: `https://faculty-availability-backend.onrender.com`
   - Frontend: `https://faculty-availability-frontend.onrender.com`

2. **Update Backend Environment Variables**:
   ```
   CLIENT_URL=https://faculty-availability-frontend.onrender.com
   SOCKET_ORIGINS=https://faculty-availability-frontend.onrender.com
   QR_BASE_URL=https://faculty-availability-frontend.onrender.com/check
   ```

3. **Update Frontend Environment Variables**:
   ```
   REACT_APP_API_URL=https://faculty-availability-backend.onrender.com/api
   REACT_APP_SOCKET_URL=https://faculty-availability-backend.onrender.com
   ```

### Step 5: Configure Redirects for React Router

Create this file to handle React Router:

```bash
# In client/public/_redirects
/*    /index.html   200
```

### Step 6: Seed Production Database

After backend deployment is complete:

1. **Go to Backend Service** → **Shell**
2. **Run Database Seeding**:
   ```bash
   npm run seed:production
   ```

## 🔧 Configuration Files Created

### `Procfile`
```
web: npm start
```

### `render.yaml` (Alternative Blueprint)
```yaml
version: 2
services:
  - type: web
    name: faculty-availability-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    
  - type: static
    name: faculty-availability-frontend
    staticPublishPath: ./client/build
    buildCommand: cd client && npm install && npm run build
```

## 🌐 Production URLs

After deployment, your app will be available at:
- **Frontend**: `https://faculty-availability-frontend.onrender.com`
- **Backend API**: `https://faculty-availability-backend.onrender.com/api`
- **Health Check**: `https://faculty-availability-backend.onrender.com/api/health`

## 🔐 Production Security Checklist

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Update CORS origins to your actual domains
- [ ] Verify HTTPS is enabled (automatic on Render)
- [ ] Test all functionality in production
- [ ] Update default faculty passwords

## 🧪 Testing Production Deployment

1. **Health Check**: Visit `/api/health` endpoint
2. **Frontend Loading**: Check if React app loads
3. **API Connection**: Test login functionality
4. **WebSocket**: Verify real-time updates work
5. **QR Codes**: Generate and test QR code scanning

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Ensure CLIENT_URL in backend matches your frontend URL exactly

### Issue 2: 404 on React Routes
**Solution**: Add `_redirects` file in `client/public/`:
```
/*    /index.html   200
```

### Issue 3: Socket.io Connection Failed
**Solution**: Verify REACT_APP_SOCKET_URL points to backend URL

### Issue 4: Database Not Seeded
**Solution**: Run seed command manually in backend shell:
```bash
node server/seed.js
```

## 🔄 Updating Deployment

To update your deployed app:
1. Push changes to GitHub
2. Render will automatically redeploy
3. Check logs in Render dashboard if issues occur

## 💡 Optimization Tips

1. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - May take 30+ seconds to wake up
   - Consider paid plan for production use

2. **Performance**:
   - Frontend builds are cached
   - Backend restarts automatically on crashes
   - Database is persistent between deployments

## 📊 Monitoring

Monitor your deployment:
- **Render Dashboard**: View logs and metrics
- **Health Check**: Automated endpoint monitoring
- **Error Tracking**: Check service logs for issues

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live faculty availability system
- ✅ Real-time status updates
- ✅ QR code generation and scanning
- ✅ Secure authentication
- ✅ Mobile-responsive design
- ✅ Production-ready hosting

Your Faculty Availability System will be live at:
`https://your-frontend-name.onrender.com`

## 🆘 Need Help?

- Check Render's deployment logs
- Verify environment variables are set correctly
- Test locally first with production environment
- Contact Render support for platform-specific issues

---

**🚀 Happy Deploying! Your Faculty Availability System will be live on the internet!**
