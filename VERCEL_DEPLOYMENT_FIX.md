# Vercel Deployment Fix Guide

## Issues Fixed

### 1. CORS Error
**Problem**: `Access-Control-Allow-Origin` header missing
**Solution**: Updated `CORS_ORIGINS` environment variable to include your frontend URL

### 2. PostgreSQL Connection Error  
**Problem**: `Please install pg package manually`
**Solution**: 
- Added `pg-hstore` dependency for better PostgreSQL support
- Updated database configuration for Vercel serverless environment
- Added SSL configuration for production database connections

## Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# CORS (CRITICAL - This fixes the CORS error)
CORS_ORIGINS=https://innovax-ui.vercel.app,http://localhost:3000,http://localhost:8080

# Security
SECRET_KEY=your-super-secure-secret-key-change-this-in-production
JWT_EXPIRATION=1800
BCRYPT_ROUNDS=12

# Application
NODE_ENV=production
DEBUG=false
DB_LOGGING=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## Deployment Steps

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Fix CORS and PostgreSQL issues for Vercel deployment"
   git push
   ```

2. **Set Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all the variables listed above
   - **Most importantly**: Set `CORS_ORIGINS=https://innovax-ui.vercel.app,http://localhost:3000,http://localhost:8080`

3. **Redeploy**:
   - Vercel will automatically redeploy when you push
   - Or manually trigger a redeploy from the Vercel dashboard

## Key Changes Made

1. **Updated `env.vercel`**: Fixed CORS origins to include your frontend URL
2. **Updated `package.json`**: Added `pg-hstore` dependency for better PostgreSQL support
3. **Updated `src/config/database.js`**: 
   - Added SSL configuration for production
   - Limited connection pool for serverless environment
   - Added retry logic for connection issues
4. **Updated `vercel.json`**: Added explicit install command to ensure all dependencies are installed
5. **Added `.vercelignore`**: Excludes unnecessary files from deployment

## Testing

After deployment, test these endpoints:
- `https://innova-x-server-v2.vercel.app/health` - Should return healthy status
- `https://innova-x-server-v2.vercel.app/test` - Should return test response
- `https://innova-x-server-v2.vercel.app/api/auth/login` - Should now accept CORS requests from your frontend

## Troubleshooting

If you still get CORS errors:
1. Verify `CORS_ORIGINS` environment variable is set correctly in Vercel
2. Check that your frontend URL exactly matches: `https://innovax-ui.vercel.app`
3. Ensure there are no trailing slashes in the URL

If you still get PostgreSQL errors:
1. Verify `DATABASE_URL` is set correctly
2. Check that your Neon database is accessible
3. Ensure SSL is enabled in your database connection string
