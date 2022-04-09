FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY server.js .
COPY build build

EXPOSE 8080
CMD [ "node", "server.js" ]
