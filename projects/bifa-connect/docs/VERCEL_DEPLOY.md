# Deploy to Vercel

## Quick Deploy


2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables (see below)
7. Click "Deploy"

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```

VITE_SUPABASE_URL=https://ueisyyvtdjogsgaouzat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaXN5eXZ0ZGpvZ3NnYW91emF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODUwNjgsImV4cCI6MjA4NzA2MTA2OH0.ZaZSUyLjoJ-L8oUFX5KC_SQDHAotz325ARvXOzaurxg


```



## Post-Deployment

1. **Update Supabase Auth Settings**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Site URL": `https://your-app.vercel.app`
   - Add to "Redirect URLs": `https://your-app.vercel.app/**`



3. **Custom Domain (Optional)**:
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update Supabase redirect URLs with custom domain

## Troubleshooting

**404 on refresh**: Fixed by `vercel.json` rewrites config

**Auth not working**: Check environment variables are set in Vercel

**Build fails**: Run `npm run build` locally first to catch errors

**Supabase connection fails**: Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct

## Files Created
- `vercel.json` - SPA routing configuration
