# FundHub Backend - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

This guide will help you deploy your FundHub Express.js backend to Vercel following all their requirements.

## Prerequisites

- [Vercel Account](https://vercel.com) (Free tier available)
- [Neon Database Account](https://neon.tech) (Free tier available)
- [GitHub Repository](https://github.com) with your code

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 1.2 Verify Structure
Your `express-backend` directory should contain:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function entry point
- ✅ `package.json` - With vercel-build script
- ✅ `src/app.js` - Express application
- ✅ `env.vercel` - Environment template

## Step 2: Deploy to Vercel

### 2.1 Create New Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set the **Root Directory** to `express-backend`

### 2.2 Configure Build Settings
- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 2.3 Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Configure Environment Variables

### 3.1 Go to Project Settings
1. In your Vercel dashboard, go to your project
2. Click "Settings" tab
3. Click "Environment Variables"

### 3.2 Add Required Variables
Add these environment variables (use values from `env.vercel`):

```bash
# Required Variables
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=your-super-secure-secret-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app
NODE_ENV=production

# Optional Variables
JWT_EXPIRATION=1800
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
FRIENDBOT_URL=https://friendbot.stellar.org
PLATFORM_WALLET_PUBLIC=your-stellar-public-key
PLATFORM_WALLET_SECRET=your-stellar-secret-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SENTRY_DSN=your-sentry-dsn
```

### 3.3 Redeploy
After adding environment variables, trigger a new deployment.

## Step 4: Test Your Deployment

### 4.1 Test Health Endpoint
```bash
curl https://your-backend-domain.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected",
  "uptime": 123.456,
  "memory": {...},
  "platform": "vercel"
}
```

### 4.2 Test Root Endpoint
```bash
curl https://your-backend-domain.vercel.app/
```

### 4.3 Test API Documentation
Visit: `https://your-backend-domain.vercel.app/api-docs`

## Step 5: Database Setup

### 5.1 Create Neon Database
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy your connection string
4. Update `DATABASE_URL` in Vercel environment variables

### 5.2 Run Migrations
```bash
# Clone your repo locally
git clone https://github.com/your-username/your-repo.git
cd your-repo/express-backend

# Install dependencies
npm install

# Set up local environment
cp env.local .env
# Edit .env with your DATABASE_URL

# Run migrations
npm run migrate
```

## Step 6: Configure CORS

### 6.1 Update CORS Origins
After deploying your frontend, update the `CORS_ORIGINS` environment variable:
```bash
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000,http://localhost:8080
```

### 6.2 Redeploy
Trigger a new deployment after updating CORS.

## Vercel-Specific Features

### Serverless Functions
- Your Express app runs as a serverless function
- Cold starts may occur on first request
- Function timeout: 30 seconds (configurable in `vercel.json`)

### Environment Variables
- Set in Vercel dashboard
- Available at runtime
- Different values for different environments (production, preview, development)

### Automatic Deployments
- Automatic deployments on git push
- Preview deployments for pull requests
- Production deployments for main branch

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version compatibility
node --version
# Should be 18.x or 20.x

# Check package.json scripts
npm run vercel-build
```

#### 2. Database Connection Errors
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db?sslmode=require
```

#### 3. CORS Errors
```bash
# Update CORS origins in Vercel dashboard
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

#### 4. Function Timeouts
- Increase timeout in `vercel.json`
- Optimize database queries
- Use connection pooling

### Debug Commands
```bash
# Check Vercel deployment status
vercel ls

# View function logs
vercel logs

# Test local environment
npm run dev
```

## Performance Optimization

### Database
- Use connection pooling
- Optimize queries
- Use indexes on frequently queried columns

### Function Optimization
- Minimize cold starts
- Use efficient middleware
- Optimize imports

### Monitoring
- Set up error tracking (Sentry)
- Monitor function performance
- Track database performance

## Security Checklist

- [ ] Strong, unique SECRET_KEY
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys stored securely

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Implement CI/CD pipelines
5. Set up staging environment

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or test locally first with `npm run dev`.
