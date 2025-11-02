#!/bin/bash

# AGI Staffers Minimal Deployment
# Only uploads essential files

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 AGI STAFFERS MINIMAL DEPLOYMENT"
echo "==================================="

# Configuration
VPS_HOST="72.60.28.175"
VPS_USER="root"
VPS_PASS="Bobby321&Gloria321Watkins?"

# Build locally
echo -e "${YELLOW}Building...${NC}"
npm run build

# Create minimal package
echo -e "${YELLOW}Creating package...${NC}"
rm -rf /tmp/deploy-package
mkdir -p /tmp/deploy-package

# Copy only essential files
cp -r .next /tmp/deploy-package/
cp -r public /tmp/deploy-package/
cp package.json /tmp/deploy-package/
cp package-lock.json /tmp/deploy-package/
cp .env.production /tmp/deploy-package/.env
cp -r prisma /tmp/deploy-package/ 2>/dev/null || true

# Create tarball
cd /tmp
tar czf deploy.tar.gz deploy-package/

# Upload and deploy
echo -e "${YELLOW}Uploading...${NC}"
sshpass -p "$VPS_PASS" scp deploy.tar.gz "${VPS_USER}@${VPS_HOST}:/tmp/"

echo -e "${YELLOW}Deploying...${NC}"
sshpass -p "$VPS_PASS" ssh "${VPS_USER}@${VPS_HOST}" << 'EOF'
# Check which env to use
if pm2 list | grep "agistaffers-green.*online" > /dev/null 2>&1; then
    DIR="/var/www/agistaffers/blue"
    PORT=3005
    NAME="agistaffers-blue"
else
    DIR="/var/www/agistaffers/green"
    PORT=3000
    NAME="agistaffers-green"
fi

# Extract and deploy
rm -rf $DIR
mkdir -p $DIR
cd $DIR
tar xzf /tmp/deploy.tar.gz --strip-components=1
npm install --production
pm2 delete $NAME 2>/dev/null || true
PORT=$PORT pm2 start npm --name $NAME -- start
pm2 save
echo "✅ Deployed to $NAME on port $PORT"
EOF

echo -e "${GREEN}✅ Deployment complete!${NC}"
rm -f /tmp/deploy.tar.gz