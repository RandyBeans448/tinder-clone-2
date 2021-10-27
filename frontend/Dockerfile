FROM node:14-alpine as builder

ENV NPM_CONFIG_LOGLEVEL info

WORKDIR /app
COPY package*.json .

EXPOSE 3000
USER node

FROM builder as dev
ENV NODE_ENV=development

FROM builder as prod
ENV NODE_ENV=production
