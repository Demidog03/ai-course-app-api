FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN node ace build

FROM base AS production
ENV NODE_ENV=production

COPY --from=build /app/build /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

EXPOSE 3333

CMD ["node", "bin/server.js"]
