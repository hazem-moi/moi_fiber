# Moi Fiber

A self-hosted fiber splicing diagram web app with real-time multi-user editing.

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

Then open http://localhost:5173

### Default Admin Account

A default admin user is created automatically on first startup:

| Field    | Default value       |
|----------|---------------------|
| Email    | `admin@example.com` |
| Password | `11335577`          |
| Name     | `admin`             |

> **⚠️ Warning:** These defaults are for development only. Override them via environment
> variables before deploying to production:
>
> ```
> DEFAULT_ADMIN_EMAIL=you@example.com
> DEFAULT_ADMIN_PASSWORD=<strong-password>
> DEFAULT_ADMIN_NAME=Administrator
> ```

## Development

### Prerequisites
- Node.js 20+
- PostgreSQL (or use Docker for just the DB: `docker compose up db`)

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET etc.

# Run DB migrations
cd packages/api
DATABASE_URL=postgresql://moi_fiber:secret@localhost:5432/moi_fiber npx prisma migrate dev --name init
cd ../..

# Start all services
npm run dev
```

### Services
- Web:       http://localhost:5173
- API:       http://localhost:3001
- Realtime:  ws://localhost:1234

## Architecture

```
packages/
  shared/    # TypeScript types shared across packages
  api/       # NestJS REST API (auth, projects, pages, color schemes)
  realtime/  # Hocuspocus Yjs WebSocket server
  web/       # React + Vite + react-konva page editor
```

## Features

- Register/login with JWT auth
- Create projects and pages
- Real-time collaborative canvas editor (Yjs + Hocuspocus)
- Add closures, trays (with clipping), and cable ends
- Create splices by dragging fiber cells
- Persistence via PostgreSQL
