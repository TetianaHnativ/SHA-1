# Використовуємо офіційний образ Nginx для статичного контенту
FROM nginx:stable

COPY . /usr/share/nginx/html

ENV PORT=80

RUN sed -i "s/80;/$PORT;/g" /etc/nginx/conf.d/default.conf

EXPOSE $PORT

