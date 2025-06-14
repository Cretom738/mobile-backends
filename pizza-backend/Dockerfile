FROM node:22.16.0-slim as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn build

FROM node:22.16.0-slim AS run

USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

WORKDIR /usr/src/app/prisma

COPY --from=builder /usr/src/app/prisma/schema.prisma .

COPY --from=builder /usr/src/app/prisma/migrations ./migrations

WORKDIR /usr/src/app

RUN yarn prisma generate

COPY --from=builder /usr/src/app/migrate.sh .

ENTRYPOINT /bin/bash ./migrate.sh node dist/src/modules/main.js
