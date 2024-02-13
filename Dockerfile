FROM node:18.15-alpine

RUN apk add --no-cache git

WORKDIR /app

RUN git clone https://github.com/Muzna-J/book-platform-server.git

WORKDIR /app/book-platform-server

RUN npm ci

EXPOSE 5005

CMD ["node", "server.js"]