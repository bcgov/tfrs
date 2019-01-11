FROM nginx:1.15-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /tfrs
COPY ready.txt /tfrs/ready.txt
RUN apk update
RUN apk add bash
