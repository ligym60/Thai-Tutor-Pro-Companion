#!/bin/bash

# Complete SSL Setup Script for VPS
# This script will set up SSL for thaiboxer-companion.cloud and zebradev.cloud

set -e

DOMAIN1="thaiboxer-companion.cloud"
DOMAIN2="zebradev.cloud"
EMAIL=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== SSL Setup for ThaiBoxer Companion ===${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Get email
if [ -z "$EMAIL" ]; then
    echo -e "${YELLOW}Enter your email for SSL certificate notifications:${NC}"
    read -p "Email: " EMAIL
fi

if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email is required${NC}"
    exit 1
fi

echo -e "${GREEN}Setting up SSL for:${NC}"
echo -e "  - $DOMAIN1 → Port 5000 (Barcode API)"
echo -e "  - $DOMAIN2 → Port 3000 (Web App)"
echo -e "${GREEN}Email: $EMAIL${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}Docker installed successfully!${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
fi

# Navigate to app directory
cd /home/thai_boxer/thaiboxer-companion

# Create necessary directories
echo -e "${GREEN}Creating directory structure...${NC}"
mkdir -p nginx/conf.d certbot/conf certbot/www

# Create Dockerfile
echo -e "${GREEN}Creating Dockerfile...${NC}"
cat > Dockerfile << 'DOCKERFILE'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose ports
EXPOSE 3000 5000

# Start the application
CMD ["node", "server_dist/index.js"]
DOCKERFILE

# Create docker-compose.yml
echo -e "${GREEN}Creating docker-compose.yml...${NC}"
cat > docker-compose.yml << 'DOCKERCOMPOSE'
version: '3.8'

services:
  app:
    build:
      context: .
    container_name: thaiboxer-app
    environment:
      - NODE_ENV=production
    expose:
      - "5000"
      - "3000"
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: thaiboxer-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - app
    networks:
      - app-network
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    container_name: thaiboxer-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
DOCKERCOMPOSE

# Create nginx.conf
echo -e "${GREEN}Creating nginx main configuration...${NC}"
cat > nginx/nginx.conf << 'NGINXCONF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
NGINXCONF

# Create app.conf for domain routing
echo -e "${GREEN}Creating nginx domain routing configuration...${NC}"
cat > nginx/conf.d/app.conf << 'APPCONF'
# Upstream definitions
upstream app_backend {
    server app:5000;
}

upstream app_port3000 {
    server app:3000;
}

# HTTP server - redirect to HTTPS (thaiboxer-companion.cloud)
server {
    listen 80;
    server_name thaiboxer-companion.cloud www.thaiboxer-companion.cloud;

    # Allow Certbot to validate domain
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTP server - redirect to HTTPS (zebradev.cloud)
server {
    listen 80;
    server_name zebradev.cloud www.zebradev.cloud;

    # Allow Certbot to validate domain
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server (thaiboxer-companion.cloud) - Routes to port 5000 (Barcode App)
server {
    listen 443 ssl http2;
    server_name thaiboxer-companion.cloud www.thaiboxer-companion.cloud;

    # SSL certificate paths (will be created by Certbot)
    ssl_certificate /etc/letsencrypt/live/thaiboxer-companion.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/thaiboxer-companion.cloud/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size
    client_max_body_size 50M;

    # WebSocket support
    location /ws {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All traffic routes to port 5000 (Express backend/Barcode app)
    location / {
        proxy_pass http://app_backend;
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

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://app_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTPS server (zebradev.cloud) - Routes to port 3000
server {
    listen 443 ssl http2;
    server_name zebradev.cloud www.zebradev.cloud;

    # SSL certificate paths (will be created by Certbot)
    ssl_certificate /etc/letsencrypt/live/zebradev.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zebradev.cloud/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size
    client_max_body_size 50M;

    # WebSocket support
    location /ws {
        proxy_pass http://app_port3000;
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
        proxy_pass http://app_port3000;
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

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://app_port3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
APPCONF

# Set correct permissions
echo -e "${GREEN}Setting permissions...${NC}"
chown -R thai_boxer:thaiboxer-companion .
chmod +x Dockerfile

# Start nginx first for certificate validation
echo -e "${GREEN}Starting nginx for certificate validation...${NC}"
docker-compose up -d nginx

# Wait for nginx to start
sleep 5

# Request SSL certificate for thaiboxer-companion.cloud
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN1...${NC}"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN1 \
    -d www.$DOMAIN1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN1 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN1${NC}"
    echo -e "${YELLOW}Common issues:${NC}"
    echo "1. DNS not properly configured (must point to this server)"
    echo "2. Port 80 blocked by firewall"
    echo "3. Domain not accessible from internet"
    exit 1
fi

# Request SSL certificate for zebradev.cloud
echo -e "${GREEN}Requesting SSL certificate for $DOMAIN2...${NC}"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN2 \
    -d www.$DOMAIN2

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate for $DOMAIN2 created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate for $DOMAIN2${NC}"
    echo -e "${YELLOW}Common issues:${NC}"
    echo "1. DNS not properly configured (must point to this server)"
    echo "2. Port 80 blocked by firewall"
    echo "3. Domain not accessible from internet"
    exit 1
fi

# Restart nginx with SSL
echo -e "${GREEN}Restarting nginx with SSL configuration...${NC}"
docker-compose restart nginx

# Start the application
echo -e "${GREEN}Starting application...${NC}"
docker-compose up -d app

echo -e "\n${GREEN}=== SSL Setup Complete! ===${NC}"
echo -e "${GREEN}Your sites are now accessible via HTTPS:${NC}"
echo -e "  - https://$DOMAIN1"
echo -e "  - https://$DOMAIN2"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Test HTTP to HTTPS redirect: curl -I http://$DOMAIN1"
echo "2. Test HTTPS connection: curl -I https://$DOMAIN1"
echo "3. Update your mobile app to use HTTPS endpoint"
echo "4. Certificates will auto-renew every 60 days"
