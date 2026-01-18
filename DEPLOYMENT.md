# Deployment Guide - AI Code Review Platform

This guide provides step-by-step instructions for deploying the AI Code Review Platform to production using free services.

## Prerequisites

- GitHub account
- Supabase account (for PostgreSQL database)
- Claude API key from Anthropic
- Vercel account (for frontend)
- Railway or Render account (for backend)

## 1. Database Setup (Supabase)

### Steps:

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Project Settings > Database
4. Copy the Connection String (URI format)
5. Save this as your `DATABASE_URL`

Example format:

```
postgresql://postgres:[password]@[host]:5432/postgres
```

## 2. Backend Deployment (Railway)

### Option A: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   ```
   PORT=3000
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_secure_random_string
   CLAUDE_API_KEY=your_claude_api_key
   NODE_ENV=production
   CORS_ORIGIN=your_frontend_url
   ```
6. Railway will automatically detect Node.js and deploy
7. Copy the deployment URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

1. Go to [Render](https://render.com)
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `ai-code-review-api`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables (same as above)
6. Click "Create Web Service"
7. Copy the deployment URL

### Run Database Migrations

After deploying, run migrations:

```bash
# Install Railway CLI or use Render Shell
npx prisma migrate deploy
npx prisma db seed
```

## 3. Frontend Deployment (Vercel)

### Steps:

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
6. Click "Deploy"
7. Vercel will build and deploy your frontend

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be provisioned

## 4. Post-Deployment Configuration

### Update CORS Settings

Make sure to update the `CORS_ORIGIN` environment variable in your backend to match your frontend URL:

```
CORS_ORIGIN=https://your-app.vercel.app
```

### Test the Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Submit test code
4. Check if AI review works
5. Verify progress tracking

## 5. Environment Variables Summary

### Backend (.env)

```
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CLAUDE_API_KEY=sk-ant-api03-...
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend.railway.app/api
```

## 6. Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:

- **Vercel**: Automatically deploys on push to main branch
- **Railway**: Automatically redeploys on push to main branch
- **Render**: Automatically redeploys on push to main branch

To disable auto-deploy, go to project settings.

## 7. Monitoring and Logs

### Backend Logs (Railway)

- Go to your project dashboard
- Click on the service
- View logs in real-time

### Backend Logs (Render)

- Go to your service dashboard
- Click "Logs" tab
- View logs in real-time

### Frontend Logs (Vercel)

- Go to your project dashboard
- Click "Deployments"
- Click on a deployment to view build logs

### Database Monitoring (Supabase)

- Go to your project dashboard
- Check Database > Logs for queries
- Monitor Database > Reports for performance

## 8. Scaling Considerations

### Free Tier Limits

**Supabase (Free)**

- 500 MB database storage
- Unlimited API requests
- Paused after 1 week of inactivity

**Railway (Free Trial)**

- $5 credit per month
- Auto-scaling enabled
- Sleep after inactivity

**Render (Free)**

- 750 hours per month
- Spins down after 15 min of inactivity
- Restarts on new requests

**Vercel (Free)**

- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS

### Upgrading

When you outgrow free tiers:

1. **Supabase**: $25/month for Pro plan (8 GB database)
2. **Railway**: Pay-as-you-go after free credit
3. **Render**: $7/month for always-on service
4. **Vercel**: $20/month for Pro plan

## 9. Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP whitelist allows Railway/Render

### CORS Errors

- Verify `CORS_ORIGIN` matches frontend URL
- Check frontend is using correct API URL
- Ensure HTTPS is used in production

### Claude API Errors

- Verify API key is valid
- Check rate limits not exceeded
- Monitor Claude API dashboard

### Build Failures

- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for errors

## 10. Security Checklist

- [ ] Strong JWT secret (min 32 characters)
- [ ] Environment variables not in code
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Database credentials secure
- [ ] API keys rotated regularly

## 11. Backup Strategy

### Database Backups (Supabase)

- Enable Point-in-Time Recovery (Pro plan)
- Or manually export via Dashboard > Database > Backups

### Code Backups

- Use Git for version control
- Push to GitHub regularly
- Tag releases for easy rollback

## Support

For issues:

1. Check logs in respective platforms
2. Review error messages
3. Consult platform documentation
4. Open GitHub issue if problem persists

## Cost Estimation

**Monthly costs for moderate usage:**

- Supabase: $0 (Free tier sufficient for MVP)
- Railway: $5-20 depending on usage
- Render: $0 (with sleep) or $7 (always-on)
- Vercel: $0 (Free tier sufficient)
- Claude API: Pay per usage (~$10-50/month for moderate use)

**Total: $10-75/month** depending on configuration and usage
