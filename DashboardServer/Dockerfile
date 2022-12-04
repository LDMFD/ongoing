FROM node:16-alpine

ARG RELEASE dev
ENV RELEASE $RELEASE

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY server.js .
COPY build build
COPY index.html index.html

EXPOSE 8080
CMD [ "node", "server.js" ]
