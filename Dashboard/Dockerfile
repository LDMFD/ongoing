FROM node:16-alpine AS base
WORKDIR /app
COPY package*.json .
#ENV NODE_OPTIONS --openssl-legacy-provider
RUN npm install

FROM base
WORKDIR /app
COPY --from=base /app/node_modules node_modules
EXPOSE 3000
CMD ["npm", "start"]
