FROM node:16-alpine AS base

WORKDIR /app

COPY package*.json .
RUN npm install

ADD public public
ADD scripts scripts
ADD src src
ADD .sentryclirc .
ADD tsconfig.json .

CMD npm run build
