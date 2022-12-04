FROM node:16-alpine AS base

WORKDIR /app

COPY package*.json .
RUN npm install --legacy-peer-deps

ADD public public
ADD scripts scripts
ADD src src
ADD .sentryclirc .
ADD jsconfig.json .

CMD npm run build
