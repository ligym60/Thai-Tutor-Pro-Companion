#!/bin/bash

# Simple SSL Setup for Existing ThaiBoxer Application
# This adds nginx + SSL without disrupting your running app

set -e

DOMAIN1="thaiboxer-companion.cloud"
DOMAIN2="zebradev.cloud"
EMAIL=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Simple SSL Setup for ThaiBoxer Companion ===${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Get email
echo -e "${YELLOW}Enter your email for SSL certificate notifications:${NC}"
read -p "Email: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email is required${NC}"
    exit 1
fi

echo -e "${GREEN}Setting up SSL for:${NC}"
echo -e "  - $DOMAIN1 → Port 5000 (Barcode API)"
echo -e "  - $DOMAIN2 → Port 3000 (Web App)"
echo -e "${GREEN}Email: $EMAIL${NC}\n"

# Install nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing nginx...${NC}"
    apt-get update
    apt-get install -y nginx
    systemctl enable nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# Install certbot
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

# Stop nginx temporarily
systemctl stop nginx

# Create nginx configuration for thaiboxer-companion.cloud
echo -e "${GREEN}Creating nginx configuration for $DOMAIN1...${NC}"
cat > /etc/nginx/sites-available/thaiboxer-companion << 'NGINX1'
# HTTP server - will be updated by certbot
server {
    listen 80;
    server_name thaiboxer-companion.cloud www.thaiboxer-companion.cloud;

    # Max upload size
    client_max_body_size 50M;

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All traffic routes to port 5000
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
NGINX1

# Create nginx configuration for zebradev.cloud
echo -e "${GREEN}Creating nginx configuration for $DOMAIN2...${NC}"
cat > /etc/nginx/sites-available/zebradev << 'NGINX2'
# HTTP server - will be updated by certbot
server {
    listen 80;
    server_name zebradev.cloud www.zebradev.cloud;

    # Max upload size
    client_max_body_size 50M;

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All traffic routes to port 3000
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
NGINX2

# Enable sites
ln -sf /etc/nginx/sites-available/thaiboxer-companion /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/zebradev /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Start nginx
systemctl start nginx

echo -e "${GREEN}✓ Nginx configured and started${NC}\n"

# Request SSL certificate for thaiboxer-companion.cloud
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN1...${NC}"
certbot --nginx -d $DOMAIN1 -d www.$DOMAIN1 --email $EMAIL --agree-tos --no-eff-email --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN1 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN1${NC}"
    echo -e "${YELLOW}Common issues:${NC}"
    echo "1. DNS not pointing to this server"
    echo "2. Port 80/443 blocked by firewall"
    echo "3. Domain not accessible from internet"
    exit 1
fi

# Request SSL certificate for zebradev.cloud
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN2...${NC}"
certbot --nginx -d $DOMAIN2 -d www.$DOMAIN2 --email $EMAIL --agree-tos --no-eff-email --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN2 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN2${NC}"
    echo -e "${YELLOW}Common issues:${NC}"
    echo "1. DNS not pointing to this server"
    echo "2. Port 80/443 blocked by firewall"
    echo "3. Domain not accessible from internet"
    exit 1
fi

# Add certbot renewal to cron
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -

echo -e "\n${GREEN}=== SSL Setup Complete! ===${NC}"
echo -e "${GREEN}Your sites are now accessible via HTTPS:${NC}"
echo -e "  - https://$DOMAIN1"
echo -e "  - https://$DOMAIN2"
echo -e "\n${GREEN}SSL certificates will auto-renew daily at 3 AM${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Test: curl -I https://$DOMAIN1"
echo "2. Test: curl -I https://$DOMAIN2"
echo "3. Update mobile app to use HTTPS endpoint"
echo "4. Check status: systemctl status nginx"
