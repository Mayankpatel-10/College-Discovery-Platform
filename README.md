# College Discovery Platform

A full-stack application built for discovering, saving, and comparing colleges across the country.

## Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database ORM:** Prisma ORM
- **Database:** PostgreSQL (Neon Serverless)
- **Authentication:** NextAuth.js (Credentials Provider with JWT sessions)

## Features

- **Search & Filters:** Search colleges dynamically with query parameters, paginated listings, and filter choices (location, average package, yearly fees).
- **Compare Colleges:** Select up to 3 colleges and compare their average/highest packages, yearly fees, location, rating, and top courses side-by-side.
- **Saved Colleges:** Bookmarks colleges dynamically when logged in and view them organized inside a private student dashboard.
- **Authentication:** Secure register, login, and protected routes backed by NextAuth JWT edge-level request proxy validation.

## Architecture

```
Frontend (React Client Components)
   │
   ▼
API Routes (Next.js App API Endpoints & safe Zod validation)
   │
   ▼
Prisma Client ORM (Query builder & strict type-safety)
   │
   ▼
PostgreSQL Database (Neon Serverless Hosting)
```

## Deployment

Deploy this platform on **Vercel** with a **Neon Database**:
1. Run migrations and database seeding using `npx prisma migrate dev` and `npx prisma db seed`.
2. Configure environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) on Vercel settings.
3. Deploy the project.
