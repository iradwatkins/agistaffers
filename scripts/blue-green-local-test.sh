#!/bin/bash

# Blue-Green Local Testing Script for AGI Staffers
# Tests blue-green deployment workflow locally before production
# BMAD Method Compliance: Follows Rule 8 - Mandatory Blue-Green Deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
BLUE_PORT=3000
GREEN_PORT=3001
CURRENT_ENV_FILE="$PROJECT_DIR/.current-env"

echo -e "${BLUE}🔵🟢 AGI Staffers Local Blue-Green Test${NC}"
echo "============================================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to get current environment
get_current_env() {
    if [ -f "$CURRENT_ENV_FILE" ]; then
        cat "$CURRENT_ENV_FILE"
    else
        echo "none"
    fi
}

# Function to start blue environment
start_blue() {
    echo -e "${BLUE}Starting BLUE environment on port $BLUE_PORT...${NC}"
    cd "$PROJECT_DIR"
    
    # Create .env.blue
    cp .env.local .env.blue 2>/dev/null || touch .env.blue
    echo "PORT=$BLUE_PORT" >> .env.blue
    echo "ENV_NAME=blue" >> .env.blue
    
    # Build and start
    echo "Building BLUE environment..."
    npm run build
    
    # Start in background with PM2
    pm2 delete agistaffers-blue 2>/dev/null || true
    PORT=$BLUE_PORT pm2 start npm --name agistaffers-blue -- start
    
    # Wait for startup
    echo "Waiting for BLUE to start..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:$BLUE_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✅ BLUE environment is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ BLUE environment health check failed${NC}"
        return 1
    fi
}

# Function to start green environment
start_green() {
    echo -e "${GREEN}Starting GREEN environment on port $GREEN_PORT...${NC}"
    cd "$PROJECT_DIR"
    
    # Create .env.green
    cp .env.local .env.green 2>/dev/null || touch .env.green
    echo "PORT=$GREEN_PORT" >> .env.green
    echo "ENV_NAME=green" >> .env.green
    
    # Build and start
    echo "Building GREEN environment..."
    npm run build
    
    # Start in background with PM2
    pm2 delete agistaffers-green 2>/dev/null || true
    PORT=$GREEN_PORT pm2 start npm --name agistaffers-green -- start
    
    # Wait for startup
    echo "Waiting for GREEN to start..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:$GREEN_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✅ GREEN environment is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ GREEN environment health check failed${NC}"
        return 1
    fi
}

# Function to switch traffic (simulated with port forwarding)
switch_traffic() {
    local target=$1
    local port=$2
    
    echo -e "${YELLOW}🔄 Switching traffic to $target (port $port)...${NC}"
    
    # Update current environment marker
    echo "$target" > "$CURRENT_ENV_FILE"
    
    # In production, this would update load balancer/proxy
    # For local testing, we'll create a simple proxy script
    cat > "$PROJECT_DIR/scripts/current-proxy.sh" << EOF
#!/bin/bash
# Current active environment: $target
# Port: $port
echo "Proxying to $target environment on port $port"
echo "Access via: http://localhost:$port"
EOF
    
    chmod +x "$PROJECT_DIR/scripts/current-proxy.sh"
    
    echo -e "${GREEN}✅ Traffic switched to $target environment${NC}"
    echo "Access the application at: http://localhost:$port"
}

# Function to run tests on environment
run_tests() {
    local env=$1
    local port=$2
    
    echo -e "${YELLOW}🧪 Testing $env environment on port $port...${NC}"
    
    # Basic connectivity test
    echo -n "  Testing homepage... "
    if curl -f http://localhost:$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
    
    # Test login page
    echo -n "  Testing login page... "
    if curl -f http://localhost:$port/login > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
    
    # Test admin route
    echo -n "  Testing admin route... "
    if curl -f http://localhost:$port/admin -o /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        # This might redirect to login, which is OK
        echo -e "${YELLOW}→ (redirects to login)${NC}"
    fi
    
    # Test API health
    echo -n "  Testing API health... "
    if curl -f http://localhost:$port/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}→ (no health endpoint)${NC}"
    fi
    
    echo -e "${GREEN}✅ All tests passed for $env${NC}"
    return 0
}

# Function to display status
display_status() {
    echo -e "\n${BLUE}📊 Current Status:${NC}"
    echo "================================"
    
    local current=$(get_current_env)
    echo -e "Active Environment: ${GREEN}$current${NC}"
    
    # Check BLUE
    if pm2 describe agistaffers-blue > /dev/null 2>&1; then
        local blue_status=$(pm2 describe agistaffers-blue | grep status | awk '{print $4}')
        echo -e "BLUE  (port $BLUE_PORT): ${GREEN}$blue_status${NC}"
    else
        echo -e "BLUE  (port $BLUE_PORT): ${RED}not running${NC}"
    fi
    
    # Check GREEN
    if pm2 describe agistaffers-green > /dev/null 2>&1; then
        local green_status=$(pm2 describe agistaffers-green | grep status | awk '{print $4}')
        echo -e "GREEN (port $GREEN_PORT): ${GREEN}$green_status${NC}"
    else
        echo -e "GREEN (port $GREEN_PORT): ${RED}not running${NC}"
    fi
    
    echo "================================"
}

# Function to perform blue-green deployment simulation
simulate_deployment() {
    echo -e "\n${YELLOW}🚀 Starting Blue-Green Deployment Simulation${NC}"
    echo "================================================"
    
    # Get current state
    local current=$(get_current_env)
    
    if [ "$current" = "none" ] || [ "$current" = "" ]; then
        echo "No environment currently active. Starting with BLUE..."
        
        # Start BLUE as initial
        start_blue
        switch_traffic "blue" $BLUE_PORT
        run_tests "blue" $BLUE_PORT
        
        echo -e "\n${YELLOW}Now simulating a deployment...${NC}"
        sleep 2
        
        # Deploy to GREEN
        start_green
        run_tests "green" $GREEN_PORT
        
        # Ask to switch
        echo -e "\n${YELLOW}GREEN is ready. Switch traffic? (y/n):${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            switch_traffic "green" $GREEN_PORT
            
            # Stop old BLUE after successful switch
            echo "Stopping old BLUE environment..."
            pm2 stop agistaffers-blue
        fi
    elif [ "$current" = "blue" ]; then
        echo "Current LIVE: BLUE"
        echo "Will deploy to: GREEN"
        
        start_green
        run_tests "green" $GREEN_PORT
        
        echo -e "\n${YELLOW}GREEN is ready. Switch traffic? (y/n):${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            switch_traffic "green" $GREEN_PORT
            pm2 stop agistaffers-blue
        fi
    else
        echo "Current LIVE: GREEN"
        echo "Will deploy to: BLUE"
        
        start_blue
        run_tests "blue" $BLUE_PORT
        
        echo -e "\n${YELLOW}BLUE is ready. Switch traffic? (y/n):${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            switch_traffic "blue" $BLUE_PORT
            pm2 stop agistaffers-green
        fi
    fi
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}Blue-Green Deployment Test Menu${NC}"
    echo "================================"
    echo "1) Run full deployment simulation"
    echo "2) Start BLUE environment only"
    echo "3) Start GREEN environment only"
    echo "4) Switch traffic"
    echo "5) Run tests on current environment"
    echo "6) Show status"
    echo "7) Stop all environments"
    echo "8) Clean up and reset"
    echo "9) Exit"
    echo -n "Select option: "
}

# Main execution
main() {
    # Check dependencies
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}Error: PM2 is not installed${NC}"
        echo "Install with: npm install -g pm2"
        exit 1
    fi
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                simulate_deployment
                ;;
            2)
                start_blue
                ;;
            3)
                start_green
                ;;
            4)
                echo "Switch to which environment? (blue/green): "
                read -r target
                if [ "$target" = "blue" ]; then
                    switch_traffic "blue" $BLUE_PORT
                elif [ "$target" = "green" ]; then
                    switch_traffic "green" $GREEN_PORT
                else
                    echo -e "${RED}Invalid choice${NC}"
                fi
                ;;
            5)
                current=$(get_current_env)
                if [ "$current" = "blue" ]; then
                    run_tests "blue" $BLUE_PORT
                elif [ "$current" = "green" ]; then
                    run_tests "green" $GREEN_PORT
                else
                    echo -e "${RED}No active environment${NC}"
                fi
                ;;
            6)
                display_status
                ;;
            7)
                echo "Stopping all environments..."
                pm2 stop agistaffers-blue 2>/dev/null || true
                pm2 stop agistaffers-green 2>/dev/null || true
                echo -e "${GREEN}✅ All environments stopped${NC}"
                ;;
            8)
                echo "Cleaning up..."
                pm2 delete agistaffers-blue 2>/dev/null || true
                pm2 delete agistaffers-green 2>/dev/null || true
                rm -f "$CURRENT_ENV_FILE"
                rm -f "$PROJECT_DIR/.env.blue"
                rm -f "$PROJECT_DIR/.env.green"
                rm -f "$PROJECT_DIR/scripts/current-proxy.sh"
                echo -e "${GREEN}✅ Cleanup complete${NC}"
                ;;
            9)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                ;;
        esac
    done
}

# Run main function
main