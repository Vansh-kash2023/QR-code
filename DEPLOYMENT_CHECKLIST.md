# 📋 Render Deployment Checklist

## Pre-Deployment ✅

- [ ] Code is working locally (both frontend and backend)
- [ ] All files are committed to Git
- [ ] Repository is pushed to GitHub
- [ ] Environment variables are configured
- [ ] Database seeding script is ready

## Deployment Files ✅

- [ ] `Procfile` exists in root
- [ ] `render.yaml` exists in root  
- [ ] `client/public/_redirects` exists
- [ ] `.env.production` exists in root
- [ ] `client/.env.production` exists

## Backend Service Configuration

### Basic Settings:
- [ ] **Name**: `faculty-availability-backend`
- [ ] **Environment**: Node
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Health Check Path**: `/api/health`

### Environment Variables:
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET=your-secure-secret`
- [ ] `CLIENT_URL=https://your-frontend.onrender.com`
- [ ] `PORT` (auto-set by Render)

## Frontend Service Configuration

### Basic Settings:
- [ ] **Name**: `faculty-availability-frontend`
- [ ] **Root Directory**: `client`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `build`

### Environment Variables:
- [ ] `REACT_APP_API_URL=https://your-backend.onrender.com/api`
- [ ] `REACT_APP_SOCKET_URL=https://your-backend.onrender.com`
- [ ] `REACT_APP_QR_BASE_URL=https://your-frontend.onrender.com/check`

## Post-Deployment Testing ✅

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Faculty login works
- [ ] Status updates work in real-time
- [ ] QR code generation works
- [ ] QR code scanning redirects properly
- [ ] Mobile responsiveness works

## Database Setup ✅

- [ ] Run seed command in backend shell: `node server/seed.js`
- [ ] Verify sample faculty are created
- [ ] Test login with sample credentials

## Final Steps ✅

- [ ] Update production passwords
- [ ] Test all major features
- [ ] Share production URLs
- [ ] Monitor logs for any errors

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CLIENT_URL matches frontend URL exactly
2. **404 on Routes**: Ensure `_redirects` file exists in `client/public/`
3. **Socket Connection Failed**: Verify SOCKET_URL points to backend
4. **Build Failures**: Check build logs and fix any errors

### Useful Commands:
```bash
# View backend logs
render logs <service-id>

# Restart service
render restart <service-id>

# Run shell command
render shell <service-id>
```

---

**✅ Once all items are checked, your Faculty Availability System should be live!**
