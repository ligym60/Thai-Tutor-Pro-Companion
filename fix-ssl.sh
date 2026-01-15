#!/bin/bash

# Fix SSL Setup - Only main domains (no www)

set -e

DOMAIN1="thaiboxer-companion.cloud"
DOMAIN2="zebradev.cloud"
EMAIL="ligym60@yahoo.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Fixing SSL Setup (Main Domains Only) ===${NC}\n"

# Stop nginx
systemctl stop nginx

# Update nginx configuration for thaiboxer-companion.cloud (remove www)
echo -e "${GREEN}Updating nginx configuration for $DOMAIN1...${NC}"
cat > /etc/nginx/sites-available/thaiboxer-companion << 'NGINX1'
# HTTP server - will be updated by certbot
server {
    listen 80;
    server_name thaiboxer-companion.cloud;

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

# Update nginx configuration for zebradev.cloud (remove www)
echo -e "${GREEN}Updating nginx configuration for $DOMAIN2...${NC}"
cat > /etc/nginx/sites-available/zebradev << 'NGINX2'
# HTTP server - will be updated by certbot
server {
    listen 80;
    server_name zebradev.cloud;

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

# Test nginx configuration
nginx -t

# Start nginx
systemctl start nginx

echo -e "${GREEN}✓ Nginx updated${NC}\n"

# Request SSL certificate for thaiboxer-companion.cloud (no www)
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN1...${NC}"
certbot --nginx -d $DOMAIN1 --email $EMAIL --agree-tos --no-eff-email --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN1 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN1${NC}"
    exit 1
fi

# Request SSL certificate for zebradev.cloud (no www)
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN2...${NC}"
certbot --nginx -d $DOMAIN2 --email $EMAIL --agree-tos --no-eff-email --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN2 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN2${NC}"
    exit 1
fi

# Add certbot renewal to cron (remove duplicate if exists)
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -

echo -e "\n${GREEN}=== SSL Setup Complete! ===${NC}"
echo -e "${GREEN}Your sites are now accessible via HTTPS:${NC}"
echo -e "  - https://$DOMAIN1"
echo -e "  - https://$DOMAIN2"
echo -e "\n${GREEN}SSL certificates will auto-renew daily at 3 AM${NC}"
