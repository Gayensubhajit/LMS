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
Clerk webhook + user sync endpoint is now included:
- `POST /webhooks/clerk`
- verifies Svix signature
- upserts `user.created` / `user.updated`
- deletes on `user.deleted`

### Clerk webhook local setup
1. Set `CLERK_WEBHOOK_SECRET` in backend `.env`
2. In Clerk Dashboard, create webhook endpoint:
   - URL: `http://localhost:4000/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
3. Start backend:

```bash
cd backend
npm run dev
```

## Step 3 APIs (published courses)
Public read routes are now available:
- `GET /courses` (supports `category`, `level`, `q`)
- `GET /courses/:slug`
- `GET /courses/:slug/lessons`

Example:
```bash
curl "http://localhost:4000/courses?q=react"
curl "http://localhost:4000/courses/react-nextjs-mastery-2026"
curl "http://localhost:4000/courses/react-nextjs-mastery-2026/lessons"
```

## Step 4 APIs (enrollment + access control)
Headers required for protected routes:
- `x-clerk-user-id: <clerk_user_id>`

### Create/update enrollment
`POST /enrollments`
```json
{
  "courseSlug": "react-nextjs-mastery-2026",
  "plan": "3month"
}
```

### Get my enrollments
`GET /enrollments/me`

### Check course access
`GET /access/courses/:slug`

### Check lesson access
`GET /access/lessons/:lessonId`

Access rules:
- Active enrollment and not expired => allowed
- Preview lesson => allowed even without enrollment

## Step 5 APIs (payment orders + webhooks)
### Create payment order
`POST /payments/create-order`

Headers:
- `x-clerk-user-id: <clerk_user_id>`

Body:
```json
{
  "enrollmentId": "enr_cuid_here",
  "provider": "razorpay",
  "currency": "INR"
}
```

Provider options:
- `razorpay`
- `stripe`

### Razorpay webhook
`POST /payments/webhooks/razorpay`
- verifies `x-razorpay-signature`
- updates `payment_orders` status
- activates enrollment on successful capture

### Stripe webhook
`POST /payments/webhooks/stripe`
- verifies `stripe-signature`
- updates `payment_orders` status
- activates enrollment on `payment_intent.succeeded`

## Step 6 APIs (progress tracking)
Protected routes require:
- `x-clerk-user-id: <clerk_user_id>`

### Mark lesson progress
`POST /progress/lessons/:lessonId`
```json
{
  "isCompleted": true
}
```

### Course progress summary
`GET /progress/courses/:slug`
- returns completed lessons, total lessons, and `progressPercent`

### Continue learning pointer
`GET /progress/courses/:slug/continue`
- returns the next uncompleted lesson (or last lesson if all done)

## Step 7 APIs (dashboard / my-courses)
Protected routes require:
- `x-clerk-user-id: <clerk_user_id>`

### My courses dashboard cards
`GET /dashboard/my-courses`
- returns enrolled active courses with:
  - plan and amount
  - progress summary
  - continue-learning next lesson pointer

### Dashboard overview stats
`GET /dashboard/overview`
- returns:
  - active enrollment count
  - completed lessons count
  - nearest expiring enrollment

