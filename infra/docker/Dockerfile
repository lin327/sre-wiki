FROM nginx:1.27-alpine

LABEL org.opencontainers.image.source="https://github.com/lin327/sre-wiki"
LABEL org.opencontainers.image.description="SRE Atlas - AI-driven operations knowledge base"

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/healthz || exit 1
