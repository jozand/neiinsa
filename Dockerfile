FROM node:20.10.0-alpine

ENV NODE_ENV production
ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false

RUN apk add --update --no-cache \
    libuuid \
    build-base \
    pkgconf \
    pixman \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm start
