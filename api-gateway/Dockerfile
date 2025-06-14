FROM node:22.16.0-slim

USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY . .

CMD [ "node", "server.js" ]