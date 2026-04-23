FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --legacy-peer-deps

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev --legacy-peer-deps


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "echo '>>> [1/4] Container started'; echo '>>> [2/4] Running prisma migrate deploy'; /app/node_modules/.bin/prisma migrate deploy || (echo '>>> MIGRATE FAILED' && exit 1); echo '>>> [3/4] Migrations done. Starting Node app...'; node /app/dist/main.js; echo '>>> [4/4] Node process exited with code '$?"]
