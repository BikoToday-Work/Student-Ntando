# BIFA Platform Deployment Guide - Step by Step

## Quick Deploy Backend & Frontend

### Step 1: Deploy Backend First

1. **Install Vercel CLI** (if not installed)
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Backend from project root**
```bash
cd backend
vercel --prod --config ../vercel-backend.json
```

4. **Set Environment Variables** (when prompted or via dashboard)
```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add FOOTBALL_API_KEY
```

5. **Copy the backend URL** (e.g., `https://your-backend-xyz.vercel.app`)

### Step 2: Connect Frontend to Backend

1. **Update frontend environment**
```bash
cd ../frontend
```

2. **Edit `.env.local`**
```env
NEXT_PUBLIC_API_URL=https://your-backend-xyz.vercel.app
```

3. **Deploy Frontend**
```bash
vercel --prod
```

### Step 3: Test Connection

1. **Test Backend Health**
```bash
curl https://your-backend-xyz.vercel.app/
```

2. **Test API Endpoint**
```bash
curl https://your-backend-xyz.vercel.app/api/competitions
```

3. **Test Frontend Connection**
- Visit your frontend URL
- Check browser console for API calls
- Test login with: `admin@bifa.com` / `admin123`

### Step 4: Fix CORS (if needed)

If you get CORS errors, update `backend/src/index.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app', // Add your actual frontend URL
    'https://*.vercel.app'
  ],
  credentials: true
};
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

## Troubleshooting

### Backend Issues
- **500 Error**: Check Vercel function logs
- **Module Error**: Ensure CommonJS syntax (require/module.exports)
- **Timeout**: Check if function completes within 10s

### Frontend Issues
- **API Connection Failed**: Verify `NEXT_PUBLIC_API_URL` is correct
- **CORS Error**: Update backend CORS origins
- **Build Error**: Check Next.js build logs

### Quick Fixes

1. **Backend not responding**:
```bash
vercel logs --prod
```

2. **Frontend can't reach backend**:
- Check Network tab in browser
- Verify environment variable is set
- Test backend URL directly

3. **Environment variables not working**:
- Set via Vercel dashboard: Settings > Environment Variables
- Redeploy after adding variables

## Complete Working URLs

After successful deployment:
- Backend: `https://your-backend-xyz.vercel.app`
- Frontend: `https://your-frontend-abc.vercel.app`
- Health Check: `https://your-backend-xyz.vercel.app/`
- API Test: `https://your-backend-xyz.vercel.app/api/competitions`