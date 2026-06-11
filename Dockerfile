# ---- Builder stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine AS production

# Fix permissions for non-root execution
RUN rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp /tmp/nginx && \
    chown -R 101:101 /var/cache/nginx /var/run /tmp/nginx && \
    sed -i 's|/var/run/nginx.pid|/tmp/nginx/nginx.pid|' /etc/nginx/nginx.conf && \
    sed -i 's|user  nginx;|#user  nginx;|' /etc/nginx/nginx.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Astro output
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as non-root
USER 101

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
