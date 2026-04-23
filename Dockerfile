FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev


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
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
