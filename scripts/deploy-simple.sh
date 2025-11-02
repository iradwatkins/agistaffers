#!/bin/bash

# AGI Staffers Simple Production Deployment
# Uses Next.js normal build without standalone for simplicity

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 AGI STAFFERS SIMPLE DEPLOYMENT${NC}"
echo "==========================================="

# Configuration
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
VPS_HOST="72.60.28.175"
VPS_USER="root"
VPS_PASS="Bobby321&Gloria321Watkins?"

# Step 1: Build locally
echo -e "\n${YELLOW}Building application...${NC}"
cd "$PROJECT_DIR"
npm run build

# Step 2: Deploy directly to VPS
echo -e "\n${YELLOW}Deploying to VPS...${NC}"

# Use sshpass to run commands on VPS
sshpass -p "$VPS_PASS" ssh "${VPS_USER}@${VPS_HOST}" << 'REMOTE_COMMANDS'
# Determine which environment to deploy to
if pm2 status | grep "agistaffers-green" | grep "online" > /dev/null; then
    ENV="blue"
    PORT=3005
    echo "Deploying to Blue environment on port 3005"
else
    ENV="green"  
    PORT=3000
    echo "Deploying to Green environment on port 3000"
fi

# Stop old instance
pm2 delete "agistaffers-$ENV" 2>/dev/null || true

# Clone or pull latest code
cd /var/www/agistaffers
if [ ! -d "$ENV" ]; then
    git clone https://github.com/your-repo/agistaffers.git "$ENV"
fi

cd "$ENV"
git pull origin main

# Install dependencies
npm install --production

# Build on server
npm run build

# Start with PM2
PORT=$PORT pm2 start npm --name "agistaffers-$ENV" -- start

# Save PM2 config
pm2 save

echo "✅ Deployment complete! Running on port $PORT"
REMOTE_COMMANDS

echo -e "\n${GREEN}✅ Deployment successful!${NC}"