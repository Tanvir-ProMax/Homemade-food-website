# Deployment Guide for Homemade Food by Maria

This guide will help you deploy the frontend and backend of Homemade Food by Maria.

## Prerequisites

- GitHub account with this repository
- MongoDB Atlas account (already configured)
- Vercel account (for frontend)
- Render account (for backend)

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Environment Variables

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New+** → **Web Service**
3. Connect your GitHub repository: `Tanvir-ProMax/Homemade-food-website`
4. Configure deployment:
   
   **Build & Deploy:**
   - Name: `homemade-food-api`
   - Root Directory: `Backend`
   - Runtime: `Node 18`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   
   **Environment Variables:**
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://tanvirdewan2006_db_user:I181YkSr8Z86c3Wa@database.zcs0nrd.mongodb.net/?appName=Database`
   - `JWT_SECRET`: [Your generated secret from Step 1]
   - `FRONTEND_URL`: `https://homemade-food.vercel.app` (will update later)
   
5. Click **Create Web Service**
6. Wait for deployment (2-3 minutes)
7. Copy the deployed URL (e.g., `https://homemade-food-api.onrender.com`)

### Step 3: Test Backend

```bash
curl https://homemade-food-api.onrender.com
```

You should see: `{"message":"Homemade Food by Maria API is running...","status":"healthy","environment":"production"}`

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Configure Environment Variables

Update `.env` file in root directory:
```bash
VITE_API_URL=https://homemade-food-api.onrender.com/api
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New Project**
3. Import your GitHub repository: `Tanvir-ProMax/Homemade-food-website`
4. Configure deployment:
   
   **Framework Preset:** Vite
   
   **Environment Variables:**
   - `VITE_API_URL`: `https://homemade-food-api.onrender.com/api` (from Render)
   
   **Build & Development Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `.` (leave empty)
   
5. Click **Deploy**
6. Wait for deployment (1-2 minutes)
7. Your site will be live at: `https://homemade-food.vercel.app`

### Step 3: Update Backend CORS

Go back to Render dashboard → Your Web Service → Environment Variables

Update `FRONTEND_URL` to:
```
https://homemade-food.vercel.app
```

Then click **Save Changes** and **Manual Deploy** → **Clear build cache & deploy**

---

## Part 3: MongoDB Atlas Whitelist (Important!)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your project → Network Access
3. Click **Add IP Address**
4. Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - This allows Render (dynamic IP) to connect
5. Click **Confirm**

---

## Part 4: Testing the Full Stack

### Test Backend API:
```bash
# Health check
curl https://homemade-food-api.onrender.com/health

# Register user
curl -X POST https://homemade-food-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Frontend:
1. Visit https://homemade-food.vercel.app
2. Try registering/logging in
3. Add items to cart
4. Place an order
5. Check order tracking

---

## Part 5: Troubleshooting

### Backend Issues:
- **MongoDB Connection Error**: Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0)
- **CORS Error**: Verify `FRONTEND_URL` in Render environment variables
- **Port Issues**: Ensure `PORT` is set to 5000 in Render
- **Build Failed**: Check Render logs for specific errors

### Frontend Issues:
- **API Connection Failed**: Verify `VITE_API_URL` matches backend URL
- **White Screen**: Check Vercel deployment logs
- **404 Errors**: Ensure routes are correct in React Router

### MongoDB Issues:
- **Connection Timeout**: Check MongoDB Atlas cluster status
- **Authentication Failed**: Verify MONGO_URI credentials
- **IP Whitelist**: Ensure Render can access MongoDB (allow all IPs)

---

## Part 6: Monitoring

### Render (Backend):
- Visit your dashboard at render.com
- View logs under "Logs" tab
- Monitor metrics (CPU, memory, bandwidth)

### Vercel (Frontend):
- Visit your dashboard at vercel.com
- View deployment logs
- Monitor analytics (page views, visitors)

### MongoDB Atlas:
- Visit cloud.mongodb.com
- Monitor database performance
- View slow query logs
- Check storage usage

---

## Environment Variables Reference

### Backend (Render):
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://tanvirdewan2006_db_user:I181YkSr8Z86c3Wa@database.zcs0nrd.mongodb.net/?appName=Database
JWT_SECRET=<generate-secure-secret>
FRONTEND_URL=https://homemade-food.vercel.app
```

### Frontend (Vercel):
```
VITE_API_URL=https://homemade-food-api.onrender.com/api
```

---

## Free Tier Limits

### Render:
- Free tier: 750 hours/month (~15-16 GB RAM hours)
- Sleeps after 15 minutes of inactivity
- Cold start takes ~30 seconds

### Vercel:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN

### MongoDB Atlas:
- Free tier: 512MB storage
- Shared RAM
- Rate-limited connections

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Configure MongoDB Atlas whitelist
4. ✅ Test full application
5. 🔄 Set up custom domain (optional)
6. 🔄 Add monitoring/alerts (optional)
7. 🔄 Implement payment gateway (bKash) (optional)
8. 🔄 Add email notifications (optional)

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas status

Good luck with your deployment! 🚀
