FROM nginx:stable-alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx/website-10007.conf /etc/nginx/conf.d/website-10007.conf
EXPOSE 10007
