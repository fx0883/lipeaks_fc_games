# 🚀 Deployment Guide

This guide covers various deployment options for Lipeaks FC Games, from development to production environments.

## 🌐 Live Demo

**Official Demo**: [games.espressox.online](https://games.espressox.online)

## 📋 Deployment Options

### 1. 🔄 One-Click Deployments

#### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fx0883/lipeaks_fc_games)

**Benefits:**
- Automatic deployments from GitHub
- Global CDN
- Serverless functions support
- Zero configuration

**Steps:**
1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables (if needed)
4. Deploy!

#### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fx0883/lipeaks_fc_games)

**Benefits:**
- Continuous deployment
- Form handling
- Edge functions
- Built-in analytics

#### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/fx0883/lipeaks_fc_games)

**Benefits:**
- Simple deployment process
- Automatic HTTPS
- Environment management
- Database integration

### 2. 🐳 Docker Deployment

#### Build Docker Image

```bash
# Clone the repository
git clone https://github.com/fx0883/lipeaks_fc_games.git
cd lipeaks_fc_games

# Build the Docker image
docker build -t lipeaks-fc-games .
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  lipeaks-fc-games:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

#### Pre-built Docker Image

```bash
# Pull and run the pre-built image
docker run -d -p 80:80 --name lipeaks-fc-games fx0883/lipeaks-fc-games:latest
```

### 3. 🔧 Manual Deployment

#### Prerequisites
- Node.js 16+ 
- npm or yarn
- Web server (Nginx, Apache, etc.)

#### Build Process

```bash
# Clone the repository
git clone https://github.com/fx0883/lipeaks_fc_games.git
cd lipeaks_fc_games

# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/lipeaks_fc_games/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/lipeaks_fc_games/dist
    
    # Handle client-side routing
    <Directory /path/to/lipeaks_fc_games/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Fallback to index.html for SPA
        FallbackResource /index.html
    </Directory>
    
    # Cache static assets
    <LocationMatch "\.(?:css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

### 4. ☁️ Cloud Platform Deployments

#### AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure bucket for static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

#### Google Cloud Storage

```bash
# Build the project
npm run build

# Install Google Cloud SDK
gcloud auth login

# Create bucket
gsutil mb gs://your-bucket-name

# Upload files
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://your-bucket-name
```

#### Azure Static Web Apps

```bash
# Install Azure CLI
az login

# Create resource group
az group create --name lipeaks-rg --location "East US"

# Create static web app
az staticwebapp create \
    --name lipeaks-fc-games \
    --resource-group lipeaks-rg \
    --source https://github.com/fx0883/lipeaks_fc_games \
    --location "East US" \
    --branch main \
    --app-location "/" \
    --output-location "dist"
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file for local development:

```env
# API Configuration (if needed)
VITE_API_BASE_URL=https://api.yourdomain.com

# Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Production Environment

```env
# Production settings
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_DEBUG=false
```

## 🏗️ CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSION: "18"

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh
  script:
    - rsync -avz --delete dist/ user@server:/var/www/html/
  only:
    - main
```

## 🔒 Security Considerations

### HTTPS Configuration

```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Certificate
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Your app configuration here...
}
```

### Content Security Policy

Add to your HTML head:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    media-src 'self' blob:;
    worker-src 'self' blob:;
">
```

## 📊 Performance Optimization

### Build Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          emulator: ['@emulatorjs/core-fbalpha2012_cps2']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}
```

### CDN Configuration

```html
<!-- Preload critical resources -->
<link rel="preload" href="/emulatorjs/emulator.min.js" as="script">
<link rel="preload" href="/emulatorjs/emulator.min.css" as="style">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **CORS Issues**
   - Ensure ROM files are served from same domain
   - Configure proper CORS headers

3. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max_old_space_size=4096"
   npm run build
   ```

4. **Routing Issues (404 on refresh)**
   - Configure server for SPA routing
   - Ensure fallback to index.html

### Debug Mode

```bash
# Enable debug mode
VITE_ENABLE_DEBUG=true npm run build
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Build completes without errors
- [ ] No console errors in production build
- [ ] All features work in production mode
- [ ] Performance metrics are acceptable

### Post-deployment
- [ ] Site loads correctly
- [ ] All games are playable
- [ ] Mobile responsiveness works
- [ ] All language versions function
- [ ] Analytics tracking works (if enabled)
- [ ] Error monitoring is active

## 📞 Support

If you encounter deployment issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search [existing issues](https://github.com/fx0883/lipeaks_fc_games/issues)
3. Create a new issue with deployment details

---

Happy deploying! 🚀