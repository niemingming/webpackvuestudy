FROM registry.haier.net/library/nginx:1.13.8-alpine
COPY nginx.conf /etc/nginx/conf.d
COPY dist/ /usr/share/nginx/html
