# Vercel Deployment Guide - BIFA Platform

## Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Database URL (Prisma Accelerate or direct PostgreSQL)
- Football API key

## Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=your_prisma_accelerate_url_or_postgres_url
JWT_SECRET=your_secure_jwt_secret_key
FOOTBALL_API_KEY=your_football_api_key
NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app/api
```

## Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory

### 2. Configure Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave empty for root)
- **Build Command:** `cd frontend && npm run build`
- **Output Directory:** `frontend/.next`
- **Install Command:** `npm install && cd frontend && npm install && cd ../backend && npm install`

### 3. Environment Variables
Add all the environment variables listed above in the Vercel dashboard.

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Post-Deployment Setup

### 1. Database Setup
If using a new database, run the Prisma migrations:
```bash
npx prisma migrate deploy
```

### 2. Create Admin User
After deployment, create an admin user by running the seed script locally and pointing to your production database.

## Troubleshooting

### Common Issues
1. **Build fails:** Check that all dependencies are in package.json
2. **API routes not working:** Ensure vercel.json routing is correct
3. **Database connection fails:** Verify DATABASE_URL is correct
4. **Environment variables not loading:** Check they're set in Vercel dashboard

### Logs
Check deployment logs in Vercel dashboard under "Functions" tab.

## Production URLs
- Frontend: `https://your-app-name.vercel.app`
- API: `https://your-app-name.vercel.app/api`
- Admin: `https://your-app-name.vercel.app/admin`

## Security Checklist
- [ ] All environment variables are set in Vercel (not in code)
- [ ] .env files are in .gitignore
- [ ] Default admin password changed
- [ ] Database has proper access controls
- [ ] CORS is configured correctly