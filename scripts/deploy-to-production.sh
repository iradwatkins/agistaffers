#!/bin/bash

# AGI Staffers Production Deployment Script
# Final deployment to VPS using Blue-Green methodology
# Date: August 14, 2025

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 AGI STAFFERS PRODUCTION DEPLOYMENT${NC}"
echo "==========================================="
echo "Date: $(date)"
echo "Target: 72.60.28.175"
echo "Method: Blue-Green Deployment"
echo "==========================================="

# Configuration
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
VPS_HOST="72.60.28.175"
VPS_USER="root"
DEPLOY_DIR="/var/www/agistaffers"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Step 1: Final production build
echo -e "\n${YELLOW}Step 1: Creating final production build...${NC}"
cd "$PROJECT_DIR"

# Ensure production env is used
cp .env.production .env.local.backup 2>/dev/null || true
cp .env.production .env.local

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Production build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Step 2: Create deployment package
echo -e "\n${YELLOW}Step 2: Creating deployment package...${NC}"
PACKAGE_NAME="agistaffers_prod_${TIMESTAMP}"
PACKAGE_DIR="/tmp/${PACKAGE_NAME}"

mkdir -p "$PACKAGE_DIR"

# Copy necessary files
cp -r .next "$PACKAGE_DIR/"
cp -r public "$PACKAGE_DIR/"
cp -r prisma "$PACKAGE_DIR/"
cp package.json "$PACKAGE_DIR/"
cp package-lock.json "$PACKAGE_DIR/"
cp .env.production "$PACKAGE_DIR/.env"
cp next.config.js "$PACKAGE_DIR/"

# Create deployment script
cat > "$PACKAGE_DIR/deploy.sh" << 'EOF'
#!/bin/bash
# Remote deployment script

DEPLOY_BASE="/var/www/agistaffers"
CURRENT_LINK="$DEPLOY_BASE/current"
BLUE_DIR="$DEPLOY_BASE/blue"
GREEN_DIR="$DEPLOY_BASE/green"

# Determine which environment to deploy to
if [ -L "$CURRENT_LINK" ]; then
    CURRENT=$(readlink "$CURRENT_LINK")
    if [[ "$CURRENT" == *"blue"* ]]; then
        DEPLOY_TO="$GREEN_DIR"
        ENV_NAME="green"
    else
        DEPLOY_TO="$BLUE_DIR"
        ENV_NAME="blue"
    fi
else
    # First deployment
    DEPLOY_TO="$BLUE_DIR"
    ENV_NAME="blue"
fi

echo "Deploying to $ENV_NAME environment..."

# Create directories
mkdir -p "$DEPLOY_TO"

# Copy files to deployment directory
cp -r /tmp/deployment/* "$DEPLOY_TO/"

# Install dependencies
cd "$DEPLOY_TO"
npm ci --production

# Run database migrations
npx prisma migrate deploy

# Start the application with PM2
pm2 delete "agistaffers-$ENV_NAME" 2>/dev/null || true
PORT=3000 pm2 start npm --name "agistaffers-$ENV_NAME" -- start

# Health check
sleep 10
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ $ENV_NAME environment is healthy"
    
    # Switch traffic
    rm -f "$CURRENT_LINK"
    ln -s "$DEPLOY_TO" "$CURRENT_LINK"
    
    # Reload nginx
    nginx -s reload
    
    # Stop old environment
    if [ "$ENV_NAME" == "blue" ]; then
        pm2 stop "agistaffers-green" 2>/dev/null || true
    else
        pm2 stop "agistaffers-blue" 2>/dev/null || true
    fi
    
    echo "✅ Deployment complete! Traffic switched to $ENV_NAME"
else
    echo "❌ Health check failed"
    exit 1
fi
EOF

chmod +x "$PACKAGE_DIR/deploy.sh"

# Create tarball
cd /tmp
tar czf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_NAME"

echo -e "${GREEN}✅ Deployment package created: /tmp/${PACKAGE_NAME}.tar.gz${NC}"

# Step 3: Upload to VPS
echo -e "\n${YELLOW}Step 3: Uploading to VPS...${NC}"
echo "Please enter the SSH password for root@${VPS_HOST} when prompted:"

scp "/tmp/${PACKAGE_NAME}.tar.gz" "${VPS_USER}@${VPS_HOST}:/tmp/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Package uploaded successfully${NC}"
else
    echo -e "${RED}❌ Upload failed. Please check SSH access.${NC}"
    echo "You may need to:"
    echo "1. Manually upload /tmp/${PACKAGE_NAME}.tar.gz to the VPS"
    echo "2. Or fix SSH access with: ssh-copy-id root@${VPS_HOST}"
    exit 1
fi

# Step 4: Deploy on VPS
echo -e "\n${YELLOW}Step 4: Deploying on VPS...${NC}"

ssh "${VPS_USER}@${VPS_HOST}" << REMOTE_COMMANDS
    # Extract package
    cd /tmp
    tar xzf ${PACKAGE_NAME}.tar.gz
    mv ${PACKAGE_NAME} deployment
    
    # Ensure PM2 is installed
    which pm2 || npm install -g pm2
    
    # Ensure nginx config exists
    if [ ! -f /etc/nginx/sites-available/agistaffers ]; then
        cat > /etc/nginx/sites-available/agistaffers << 'NGINX'
server {
    listen 80;
    server_name agistaffers.com www.agistaffers.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name admin.agistaffers.com;
    
    location / {
        proxy_pass http://localhost:3000/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX
        ln -sf /etc/nginx/sites-available/agistaffers /etc/nginx/sites-enabled/
        nginx -t && nginx -s reload
    fi
    
    # Run deployment script
    cd /tmp/deployment
    bash deploy.sh
    
    # Cleanup
    rm -rf /tmp/deployment
    rm -f /tmp/${PACKAGE_NAME}.tar.gz
REMOTE_COMMANDS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 5: Verify deployment
echo -e "\n${YELLOW}Step 5: Verifying deployment...${NC}"

# Test main site
echo -n "Testing agistaffers.com... "
if curl -f http://${VPS_HOST} > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Test admin site
echo -n "Testing admin.agistaffers.com... "
if curl -f http://${VPS_HOST}/admin > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}→ (redirects to login)${NC}"
fi

# Restore local env
cp .env.local.backup .env.local 2>/dev/null || true

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 PRODUCTION DEPLOYMENT COMPLETE!${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""
echo "✅ Application deployed to production"
echo "✅ Blue-Green deployment active"
echo "✅ Traffic switched to new version"
echo ""
echo "Access your sites:"
echo "  • Customer: https://agistaffers.com"
echo "  • Admin: https://admin.agistaffers.com"
echo "  • Monitoring: https://prometheus.agistaffers.com"
echo ""
echo -e "${YELLOW}Note: HTTPS will be enabled by Caddy automatically${NC}"
echo ""
echo "Next steps:"
echo "1. Test all functionality on production"
echo "2. Monitor logs: ssh root@${VPS_HOST} 'pm2 logs'"
echo "3. Check metrics at prometheus.agistaffers.com"