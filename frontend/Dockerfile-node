FROM node:8-jessie
RUN mkdir /app
WORKDIR /app
RUN apt-get update
RUN apt-get install git
ADD https://github.com/vishnubob/wait-for-it/compare/master...HEAD /dev/null
RUN git clone https://github.com/vishnubob/wait-for-it.git /wfi