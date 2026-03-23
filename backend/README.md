# LMS Backend (Step 1 Foundation)

This folder contains the initial backend scaffold and database schema.

## What is ready now
- TypeScript Express server with `/health` endpoint
- Environment parsing with Zod
- Prisma setup with PostgreSQL schema for:
  - users/roles
  - courses/sections/lessons
  - enrollments
  - payment orders
  - lesson progress
  - course reviews

## Setup
1. Copy `.env.example` to `.env`
2. Fill DB connection string and required keys
3. Install dependencies
4. Generate Prisma client and migrate DB

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Next step (Step 2)
Implement Clerk webhook + user sync endpoint:
- `POST /webhooks/clerk`
- create/update users by `clerkUserId`

