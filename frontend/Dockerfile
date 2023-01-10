FROM --platform=linux/amd64 node:14.16.1

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . .

EXPOSE 3000
