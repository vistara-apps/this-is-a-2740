# KnowYourRights AI - Deployment Guide

This guide covers deploying KnowYourRights AI to various platforms and environments.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/knowyourrights-ai)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/knowyourrights-ai)

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied (`database/schema.sql`)
- [ ] Environment variables configured
- [ ] API keys obtained (OpenAI, Pinata, Stripe)
- [ ] Domain name configured (for production)
- [ ] SSL certificate ready (for custom domains)

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# App Configuration
VITE_APP_NAME=KnowYourRights AI
VITE_APP_VERSION=1.0.0
```

### Optional Environment Variables

```env
# OpenAI (for AI features)
VITE_OPENAI_API_KEY=sk-your-openai-key

# Pinata (for IPFS storage)
VITE_PINATA_API_KEY=your-pinata-key
VITE_PINATA_SECRET_API_KEY=your-pinata-secret

# Stripe (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_your-stripe-key
```

## 🌐 Platform-Specific Deployments

### Vercel Deployment

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables
   - Ensure they're available for Production, Preview, and Development

3. **Build Configuration**
   Vercel auto-detects Vite projects. No additional configuration needed.

4. **Custom Domain** (Optional)
   - Go to Domains tab in Vercel dashboard
   - Add your custom domain
   - Configure DNS records as instructed

### Netlify Deployment

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

3. **Deploy**
   ```bash
   # Manual deploy
   npm run build
   npx netlify deploy --prod --dir=dist

   # Or connect Git repository for auto-deploy
   ```

### Docker Deployment

1. **Build and Run**
   ```bash
   # Build the image
   docker build -t knowyourrights-ai .

   # Run with environment file
   docker run -p 3000:3000 --env-file .env knowyourrights-ai
   ```

2. **Docker Compose**
   ```bash
   # Development
   docker-compose up

   # Production with nginx
   docker-compose --profile production up -d
   ```

3. **Docker Hub**
   ```bash
   # Tag and push to registry
   docker tag knowyourrights-ai your-registry/knowyourrights-ai:latest
   docker push your-registry/knowyourrights-ai:latest
   ```

### AWS Deployment

#### AWS Amplify
1. Connect your Git repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

#### AWS S3 + CloudFront
1. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **CloudFront Configuration**
   - Create distribution pointing to S3 bucket
   - Configure custom error pages for SPA routing
   - Set up SSL certificate

### Google Cloud Platform

#### Cloud Run
1. **Build and Deploy**
   ```bash
   # Build and push to Container Registry
   gcloud builds submit --tag gcr.io/PROJECT-ID/knowyourrights-ai

   # Deploy to Cloud Run
   gcloud run deploy --image gcr.io/PROJECT-ID/knowyourrights-ai --platform managed
   ```

2. **Environment Variables**
   ```bash
   gcloud run services update knowyourrights-ai \
     --set-env-vars VITE_SUPABASE_URL=your-url,VITE_SUPABASE_ANON_KEY=your-key
   ```

### Azure Deployment

#### Azure Static Web Apps
1. **GitHub Integration**
   - Connect repository in Azure portal
   - Configure build workflow

2. **Build Configuration**
   ```yaml
   # .github/workflows/azure-static-web-apps.yml
   app_location: "/"
   api_location: ""
   output_location: "dist"
   ```

## 🔒 Security Configuration

### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://api.openai.com https://api.pinata.cloud;
  font-src 'self';
">
```

### HTTPS Configuration
- Always use HTTPS in production
- Configure HSTS headers
- Use secure cookies for authentication

### Environment Security
- Never commit `.env` files
- Use platform-specific secret management
- Rotate API keys regularly
- Monitor for exposed secrets

## 📊 Monitoring & Analytics

### Health Checks
```javascript
// Add to your deployment
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION
  })
})
```

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Performance Monitoring
- Lighthouse CI for performance audits
- Web Vitals monitoring
- Supabase dashboard for database metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check platform-specific configuration
   - Verify variables are set for correct environment

3. **Supabase Connection Issues**
   - Verify URL and anon key are correct
   - Check RLS policies are properly configured
   - Ensure database schema is applied

4. **API Integration Failures**
   - Verify API keys are valid and not expired
   - Check CORS configuration
   - Monitor rate limits

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

### Performance Issues
- Enable gzip compression
- Configure CDN for static assets
- Optimize images and fonts
- Use code splitting for large bundles

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Create an issue in the repository
4. Contact support at support@knowyourrights-ai.com

---

**Note**: Always test deployments in a staging environment before deploying to production.
