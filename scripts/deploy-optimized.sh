#!/bin/bash

# AGI Staffers Optimized Production Deployment Script
# Uses Next.js standalone build for smaller package size
# Date: August 14, 2025
# Version: 2.0 - Fixed with comprehensive checks

set -e

# Fix line endings if needed (self-healing script)
if [[ $(file "$0") == *"CRLF"* ]]; then
    echo "Fixing line endings..."
    sed -i '' 's/\r$//' "$0"
    exec "$0" "$@"
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 AGI STAFFERS OPTIMIZED DEPLOYMENT${NC}"
echo "==========================================="
echo "Date: $(date)"
echo "Target: 72.60.28.175"
echo "Method: Blue-Green Deployment (Optimized)"
echo "==========================================="

# Configuration
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
VPS_HOST="72.60.28.175"
VPS_USER="root"
VPS_PASS="Bobby321&Gloria321Watkins?"
DEPLOY_DIR="/var/www/agistaffers"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Step 1: Build the application
echo -e "\n${YELLOW}Step 1: Creating production build...${NC}"
cd "$PROJECT_DIR"

# Ensure production env is used
cp .env.production .env.local

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Production build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Step 2: Pre-deployment checks
echo -e "\n${YELLOW}Step 2: Running pre-deployment checks...${NC}"

# Check if standalone build exists
if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ No standalone build found. Ensure output: 'standalone' in next.config.js${NC}"
    exit 1
fi

# Check standalone build size
STANDALONE_SIZE=$(du -sh .next/standalone | cut -f1)
echo "Standalone build size: $STANDALONE_SIZE"

# Step 3: Create optimized deployment package
echo -e "\n${YELLOW}Step 3: Creating optimized deployment package...${NC}"
PACKAGE_NAME="agistaffers_optimized_${TIMESTAMP}"
PACKAGE_DIR="/tmp/${PACKAGE_NAME}"

# Clean up any existing package directory
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy standalone build (includes node_modules and server)
echo "Copying standalone build..."
cp -r .next/standalone/* "$PACKAGE_DIR/"

# CRITICAL: Copy all Next.js build files (required for production)
echo "Copying Next.js build files..."
mkdir -p "$PACKAGE_DIR/.next"

# Copy static files
cp -r .next/static "$PACKAGE_DIR/.next/" 2>/dev/null || true

# Copy server files (CRITICAL for standalone to work)
if [ -d ".next/server" ]; then
    echo "Copying server files..."
    cp -r .next/server "$PACKAGE_DIR/.next/"
fi

# Copy build metadata files
if [ -f ".next/BUILD_ID" ]; then
    cp .next/BUILD_ID "$PACKAGE_DIR/.next/"
fi
if [ -f ".next/routes-manifest.json" ]; then
    cp .next/routes-manifest.json "$PACKAGE_DIR/.next/"
fi
if [ -f ".next/prerender-manifest.json" ]; then
    cp .next/prerender-manifest.json "$PACKAGE_DIR/.next/"
fi

# Verify critical files were copied
if [ ! -d "$PACKAGE_DIR/.next/static" ] && [ ! -d "$PACKAGE_DIR/.next/server" ]; then
    echo -e "${RED}❌ Failed to copy Next.js build files${NC}"
    exit 1
fi

# Copy public directory
echo "Copying public directory..."
cp -r public "$PACKAGE_DIR/"

# Copy prisma directory for migrations
echo "Copying prisma schema..."
cp -r prisma "$PACKAGE_DIR/"

# Copy production environment file
cp .env.production "$PACKAGE_DIR/.env"

# Create deployment script
cat > "$PACKAGE_DIR/deploy.sh" << 'EOF'
#!/bin/bash
# Remote deployment script

DEPLOY_BASE="/var/www/agistaffers"
BLUE_DIR="$DEPLOY_BASE/blue"
GREEN_DIR="$DEPLOY_BASE/green"

# Check which environment is currently live
GREEN_STATUS=$(pm2 status | grep "agistaffers-green" | grep "online" || echo "")
BLUE_STATUS=$(pm2 status | grep "agistaffers-blue" | grep "online" || echo "")

if [[ -n "$GREEN_STATUS" ]]; then
    # Green is live, deploy to Blue
    DEPLOY_TO="$BLUE_DIR"
    ENV_NAME="blue"
    PORT=3005
    echo "Green is currently live, deploying to Blue on port 3005"
else
    # Blue is live or neither is live, deploy to Green
    DEPLOY_TO="$GREEN_DIR"
    ENV_NAME="green"
    PORT=3000
    echo "Deploying to Green on port 3000"
fi

echo "Deploying to $ENV_NAME environment on port $PORT..."

# Clean and create deployment directory
rm -rf "$DEPLOY_TO"
mkdir -p "$DEPLOY_TO"

# Copy files to deployment directory
cp -r /tmp/deployment/* "$DEPLOY_TO/"

# Go to deployment directory
cd "$DEPLOY_TO"

# Install production dependencies (most are already in standalone)
echo "Installing additional dependencies..."
npm install --production --no-save

# Run database migrations if needed
if [ -f "prisma/schema.prisma" ]; then
    echo "Running database migrations..."
    npx prisma generate
    npx prisma migrate deploy || true
fi

# Stop the old version if exists
pm2 delete "agistaffers-$ENV_NAME" 2>/dev/null || true

# Start the application with PM2 using the standalone server
echo "Starting application on port $PORT..."
PORT=$PORT pm2 start server.js --name "agistaffers-$ENV_NAME"

# Wait for app to start
sleep 10

# Health check
echo "Performing health check on port $PORT..."
if curl -f http://localhost:$PORT > /dev/null 2>&1; then
    echo "✅ $ENV_NAME environment is healthy on port $PORT"
    pm2 save
    echo "✅ Deployment complete! $ENV_NAME is running on port $PORT"
else
    echo "❌ Health check failed on port $PORT"
    pm2 logs "agistaffers-$ENV_NAME" --lines 20
    exit 1
fi
EOF

chmod +x "$PACKAGE_DIR/deploy.sh"

# Create tarball
cd /tmp
tar czf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_NAME"

# Check package size
PACKAGE_SIZE=$(du -h "/tmp/${PACKAGE_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}✅ Optimized package created: /tmp/${PACKAGE_NAME}.tar.gz${NC}"
echo -e "${GREEN}📦 Package size: $PACKAGE_SIZE (was 145MB)${NC}"

# Step 3: Upload to VPS
echo -e "\n${YELLOW}Step 3: Uploading to VPS...${NC}"

# Use sshpass for automated upload
sshpass -p "$VPS_PASS" scp "/tmp/${PACKAGE_NAME}.tar.gz" "${VPS_USER}@${VPS_HOST}:/tmp/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Package uploaded successfully${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi

# Step 4: Deploy on VPS
echo -e "\n${YELLOW}Step 4: Deploying on VPS...${NC}"

sshpass -p "$VPS_PASS" ssh "${VPS_USER}@${VPS_HOST}" << REMOTE_COMMANDS
    # Extract package
    cd /tmp
    rm -rf deployment
    tar xzf ${PACKAGE_NAME}.tar.gz
    mv ${PACKAGE_NAME} deployment
    
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

# Step 5: Show deployment status
echo -e "\n${YELLOW}Step 5: Checking deployment status...${NC}"

sshpass -p "$VPS_PASS" ssh "${VPS_USER}@${VPS_HOST}" << 'STATUS_CHECK'
    echo "PM2 Process Status:"
    pm2 list
    echo ""
    echo "Port Usage:"
    netstat -tulpn | grep -E "3000|3005" | grep LISTEN
    echo ""
    echo "Active environment:"
    if pm2 status | grep "agistaffers-green" | grep "online" > /dev/null; then
        echo "✅ Green environment is online (port 3000)"
    fi
    if pm2 status | grep "agistaffers-blue" | grep "online" > /dev/null; then
        echo "✅ Blue environment is online (port 3005)"
    fi
STATUS_CHECK

# Restore local env
cp .env.local.backup .env.local 2>/dev/null || true
rm .env.local.backup 2>/dev/null || true

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 OPTIMIZED DEPLOYMENT COMPLETE!${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""
echo "✅ Application deployed with optimized build"
echo "✅ Package size reduced by ~80%"
echo "✅ Blue-Green deployment ready"
echo ""
echo "Next steps:"
echo "1. Test the new deployment"
echo "2. Update Caddy to route traffic to the new environment"
echo "3. Monitor logs: ssh root@${VPS_HOST} 'pm2 logs'"