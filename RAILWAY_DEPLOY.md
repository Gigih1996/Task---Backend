# Deploy Backend to Railway

**You don't need Docker.** Railway auto-detects Node.js via Nixpacks.

## Quick Steps

### 1. Prepare the repo

Push your code to GitHub. The `backend/` folder must contain:
- `package.json` with `engines.node >= 20`
- `railway.json` (build + deploy config)
- `nixpacks.toml` (pins Node 20 + OpenSSL)
- `prisma/schema.prisma` with `binaryTargets` for Linux
- `prisma/migrations/` (pre-generated migrations — commit them)

### 2. Create Railway project

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
2. Select your repo
3. When asked for the root directory, set it to `backend`

### 3. Add MySQL database

1. Inside the project → **New** → **Database** → **Add MySQL**
2. Railway auto-generates `DATABASE_URL` and injects it into your service
3. To link it explicitly: open your backend service → **Variables** → **Add Reference** → pick `MYSQL.DATABASE_URL`

### 4. Set environment variables

In your backend service → **Variables** tab:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | (reference to MySQL) | Auto-provided |
| `PORT` | (auto) | Railway injects this |
| `NODE_ENV` | `production` | |
| `CORS_ORIGIN` | `https://<your-frontend>.up.railway.app` | Update after frontend deploy |

### 5. Deploy

Railway will:
1. Run `npm ci`
2. Run `npx prisma generate`
3. Run `npm run build` (compiles TypeScript → `dist/`)
4. On start: `npx prisma migrate deploy` (applies committed migrations)
5. Launch `node dist/main.js`

Health check: `GET /api/health` (Railway auto-checks this).

### 6. Generate a public domain

Service settings → **Networking** → **Generate Domain** → you'll get e.g. `task-api.up.railway.app`.

API base URL: `https://task-api.up.railway.app/api`
Swagger docs: `https://task-api.up.railway.app/api/docs`

### 7. Update frontend

In [frontend/src/environments/environment.prod.ts](../frontend/src/environments/environment.prod.ts), set:

```ts
apiBaseUrl: 'https://task-api.up.railway.app/api'
```

Then redeploy the frontend.

---

## How It Works (behind the scenes)

### Nixpacks (default, no Docker needed)

Railway reads `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "openssl"]  # OpenSSL is required by Prisma

[phases.build]
cmds = ["npx prisma generate", "npm run build"]

[start]
cmd = "npx prisma migrate deploy && node dist/main.js"
```

### Using Docker instead (optional)

If you prefer Docker, set builder to `DOCKERFILE` in `railway.json`:

```json
{
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" }
}
```

The provided [Dockerfile](./Dockerfile) uses multi-stage build (builder + runner) based on `node:20-alpine`.

---

## Troubleshooting

### Prisma errors about OpenSSL

Ensure `schema.prisma` has:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl-openssl-3.0.x"]
}
```

### Migrations not applied

You must **commit** `prisma/migrations/` to git. Railway only runs `prisma migrate deploy` (which applies existing migrations), not `migrate dev` (which creates new ones).

### App starts but returns 502

Check that the app listens on `process.env.PORT` (via `ConfigService.get('PORT')`) and binds to `0.0.0.0` — already handled in [main.ts](./src/main.ts).

### CORS blocked in browser

Set `CORS_ORIGIN` to the exact frontend origin (including `https://`, no trailing slash).
