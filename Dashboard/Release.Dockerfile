FROM node:16-alpine AS base

ARG RELEASE dev
ENV RELEASE ${RELEASE}

WORKDIR /app

COPY package*.json .
RUN npm install

ADD public public
ADD scripts scripts
ADD src src
ADD .sentryclirc .
ADD tsconfig.json .

ARG PUBLIC_URL
ENV PUBLIC_URL ${PUBLIC_URL}

CMD npm run release
