# Hourlyplace — Deployment Guide

Deploy the Next.js app to a VPS (Ubuntu/Debian) using PM2, Nginx, and Let's Encrypt SSL.

---

## 1. Server Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v   # >= 20.x
npm -v
```

---

## 2. Clone & Build

```bash
# Clone the repo
git clone https://github.com/kswtechzone/hourlyplace.git /opt/hourlyplace
cd /opt/hourlyplace

# Install deps & build
npm ci
npm run build
```

---

## 3. PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm i -g pm2

# Start the app
pm2 start npm --name "hourlyplace" -- start
pm2 save
pm2 startup

# PM2 useful commands
# pm2 status
# pm2 logs hourlyplace
# pm2 restart hourlyplace
```

PM2 will keep the app running and auto-restart on reboot.

---

## 4. Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/hourlyplace

server {
    listen 80;
    server_name hourlyplace.com www.hourlyplace.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hourlyplace /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain & auto-configure SSL
sudo certbot --nginx -d hourlyplace.com -d www.hourlyplace.com

# Follow the prompts — certbot will modify your Nginx config for HTTPS.

# Verify auto-renewal
sudo certbot renew --dry-run
```

After this, Nginx will serve HTTPS with certificates auto-renewed every 60 days.

---

## 6. Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 7. Full Nginx Config (Final)

Once Certbot runs, your config will look like this:

```nginx
# /etc/nginx/sites-available/hourlyplace

server {
    listen 443 ssl;
    server_name hourlyplace.com www.hourlyplace.com;

    ssl_certificate /etc/letsencrypt/live/hourlyplace.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hourlyplace.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name hourlyplace.com www.hourlyplace.com;
    return 301 https://$host$request_uri;
}
```

---

## 8. Quick Reference

| Action | Command |
|--------|---------|
| Start | `pm2 start npm --name "hourlyplace" -- start` |
| Stop | `pm2 stop hourlyplace` |
| Restart | `pm2 restart hourlyplace` |
| Logs | `pm2 logs hourlyplace` |
| Status | `pm2 status` |
| Nginx reload | `sudo systemctl reload nginx` |
| Cert renew (test) | `sudo certbot renew --dry-run` |

---

*Deployment guide for Hourlyplace — KSW Techzone, Nepal*
