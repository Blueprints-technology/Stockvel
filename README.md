# Stockvel

**Invest clearly. Track confidently.**

Stockvel is a production-minded financial intelligence platform built for Nigerian and African market participants. It delivers real-time NGX equities tracking, cryptocurrency market monitoring, portfolio management, watchlists, community discussions, educational content, research reports, and newsletter distribution - all in one unified interface.

---

## What is included

| Layer              | Technology                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Zustand, React Hook Form, Zod, Lightweight Charts |
| **Backend**        | NestJS, TypeScript, PostgreSQL, Prisma ORM, Redis, JWT auth, Socket.IO, BullMQ, Swagger                                          |
| **Infrastructure** | Docker, docker-compose, GitHub Actions CI, Render/Vercel-ready packaging                                                         |
| **Monitoring**     | Sentry and PostHog environment configuration                                                                                     |
| **Data ingestion** | NGX public equities scraping (Playwright), CoinGecko crypto markets API, RSS/news curation                                       |

---

## Product surfaces

- **Landing page** - Value proposition and feature overview
- **Home / Market overview** - Real-time NGX ASI, breadth, gainers, losers, trending assets
- **Market insights** - Curated explainers and macro context
- **Stocks listing + detail pages** - Full NGX equities with charts, peers, news, and community
- **Crypto dashboard + detail pages** - Global crypto tracking with trending and market data
- **Portfolio tracker** - Multi-asset allocation, P&L, and cost basis tracking
- **Watchlist** - Cross-asset saved items with live price updates
- **Tax insights calculator** - Estimated capital gains and tax liability
- **News feed + article detail** - Curated Nigerian financial and crypto headlines
- **Learn hub** - Educational articles on investing, trading, and personal finance
- **Research desk** - Reports, podcasts, and treasury bill tracking
- **Newsletter** - Subscribe to weekly market wraps and learning picks
- **Admin console** - Moderation, analytics, newsletter operations, and provider health

---

## Architecture

```
External Sources
  ├─ NGX public web data scraper (Playwright)
  ├─ CoinGecko REST data provider
  └─ RSS/market news provider
          ↓
Data collectors / normalization layer
          ↓
PostgreSQL (Prisma models) + Redis queue/cache layer
          ↓
NestJS REST API + Socket.IO realtime gateway
          ↓
Next.js 15 frontend
```

---

## Monorepo structure

```
apps/
  api/   → NestJS backend, Prisma schema, BullMQ jobs, Swagger docs, tests
  web/   → Next.js frontend, reusable components, charts, mobile-first pages
.github/workflows/ → CI pipeline
scripts/ → Deployment helpers
```

---

## Quick start

### 1. Clone and configure

```bash
git clone <repo-url>
cd stockvel
cp .env.example .env
# Edit .env with your secrets and URLs
```

### 2. Start infrastructure

```bash
docker-compose up -d postgres redis
```

### 3. Install dependencies

```bash
npm install
```

### 4. Prepare database

```bash
npm run prisma:generate --workspace @stockvel/api
npm run prisma:migrate:dev --workspace @stockvel/api -- --name init
npm run prisma:seed --workspace @stockvel/api
```

### 5. Run apps

Frontend:

```bash
npm run dev:web
```

Backend:

```bash
npm run dev:api
```

The backend Swagger docs are available at:

```
http://localhost:4001/api/docs
```

The frontend runs at:

```
http://localhost:3000
```

---

## Default seeded accounts

| Role      | Email               | Password                                             |
| --------- | ------------------- | ---------------------------------------------------- |
| Admin     | `admin@example.com` | `ChangeMe123!` (or via `DEFAULT_ADMIN_PASSWORD` env) |
| Demo user | `demo@stockvel.com` | `Password123!`                                       |

---

## API overview

### Auth

| Method | Endpoint                       | Description          |
| ------ | ------------------------------ | -------------------- |
| POST   | `/api/v1/auth/register`        | Create account       |
| POST   | `/api/v1/auth/login`           | Authenticate         |
| POST   | `/api/v1/auth/refresh`         | Refresh access token |
| POST   | `/api/v1/auth/logout`          | End session          |
| POST   | `/api/v1/auth/forgot-password` | Request reset        |
| POST   | `/api/v1/auth/reset-password`  | Complete reset       |
| GET    | `/api/v1/auth/me`              | Current user profile |

### Market data

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/v1/dashboard/overview` | Market snapshot     |
| GET    | `/api/v1/dashboard/insights` | Curated insights    |
| GET    | `/api/v1/stocks`             | List equities       |
| GET    | `/api/v1/stocks/trending`    | Top trending stocks |
| GET    | `/api/v1/stocks/gainers`     | Top gainers         |
| GET    | `/api/v1/stocks/losers`      | Top losers          |
| GET    | `/api/v1/stocks/:ticker`     | Stock detail        |
| GET    | `/api/v1/crypto`             | List crypto assets  |
| GET    | `/api/v1/crypto/global`      | Global crypto stats |
| GET    | `/api/v1/crypto/trending`    | Trending crypto     |
| GET    | `/api/v1/crypto/:symbol`     | Crypto detail       |
| GET    | `/api/v1/news`               | News feed           |
| GET    | `/api/v1/news/:slug`         | News article        |
| GET    | `/api/v1/search?q=`          | Global search       |

### User tools

| Method | Endpoint                             | Description      |
| ------ | ------------------------------------ | ---------------- |
| GET    | `/api/v1/portfolio`                  | User portfolio   |
| POST   | `/api/v1/portfolio/add`              | Add asset        |
| DELETE | `/api/v1/portfolio/remove/:id`       | Remove asset     |
| GET    | `/api/v1/watchlist`                  | User watchlist   |
| POST   | `/api/v1/watchlist`                  | Add item         |
| POST   | `/api/v1/watchlist/reorder`          | Reorder items    |
| DELETE | `/api/v1/watchlist`                  | Remove item      |
| GET    | `/api/v1/comments`                   | List comments    |
| POST   | `/api/v1/comments/create`            | Post comment     |
| POST   | `/api/v1/comments/reply/:commentId`  | Reply to comment |
| PATCH  | `/api/v1/comments/upvote/:commentId` | Upvote comment   |

### Admin

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/v1/admin/overview`          | Platform analytics       |
| GET    | `/api/v1/admin/users`             | User list                |
| GET    | `/api/v1/admin/comments`          | Comment moderation queue |
| PATCH  | `/api/v1/admin/comments/moderate` | Moderate comment         |
| POST   | `/api/v1/admin/news/publish`      | Publish news             |

---

## Security and platform controls

- JWT access tokens + refresh token cookies with rotation
- CSRF header/cookie check for state-changing actions
- Helmet security headers
- Request throttling via Nest Throttler
- Input validation with class-validator and Zod
- Password hashing with bcrypt (12 rounds)
- Role-based admin access
- XSS sanitization on community comments
- Prisma ORM to mitigate injection vectors
- Cookie path scoping and secure flags in production

---

## Background jobs and realtime

- **BullMQ** drives stock sync, crypto sync, and news sync jobs
- **Scheduled cron** dispatch enqueues recurring jobs every 5–15 minutes
- **Socket.IO** broadcasts market overview and price-update events
- Frontend uses socket listeners to invalidate stale market queries

---

## Deployment notes

### Frontend

- Standard Next.js app, suitable for Vercel deployment
- Provide `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`

### Backend

- Dockerfile included for Render, Railway, or similar container platforms
- Works with Neon, Supabase, or managed PostgreSQL
- Redis Cloud or Upstash compatible for queues and caching
- Set production secrets for JWT, cookies, CSRF, Sentry, and PostHog

### Docker compose

Includes `postgres`, `redis`, `api`, and `web` services for local full-stack bootstrapping.

---

## Testing

- Jest service specs for backend modules
- Supertest e2e scaffold for dashboard endpoint
- Frontend smoke tests ready for extension

---

## Hardening and roadmap

The current release includes:

- Explicit health endpoint
- Tighter auth throttling
- Refresh-token rotation improvements
- Cookie path scoping
- Protected frontend panels for authenticated/admin surfaces
- Persisted session state with 401 refresh interceptor
- Moderated-reply filtering
- Docker ignore rules for cleaner builds

**Future extensions:**

- Paid market data providers (Bloomberg, Refinitiv)
- OAuth providers (Google, Apple)
- Email delivery for password resets and newsletters
- Advanced analytics and user segmentation
- Mobile app (React Native or Flutter)

---

## License

MIT - built for the African investment community.

---

**Stockvel** - _Invest clearly. Track confidently._
# Stockvel
