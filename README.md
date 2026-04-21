# LMS Platform (Next.js + Node + Prisma)

![LMS CI](https://github.com/Gayensubhajit/LMS/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Welcome to the LMS project — a modern online learning platform implementation built with Next.js (App Router), Clerk auth, Stripe checkout, and a backend powered by Node + Express-like routes and Prisma + PostgreSQL.

Author - Subhajit Gayen , Chirantan Biswas
## 🚀 Why this project is awesome

- Complete full-stack LMS from marketing pages to student dashboards, instructor tools, and admin controls
- Supports video courses, progress tracking, achievements, certifications, and enrollment logic
- Built with best-in-class dev stack:
  - Frontend: Next.js 14+, TypeScript, Tailwind CSS, React Server Components
  - Backend: Node, TypeScript, Prisma ORM, REST-like routes 
  - Auth: Clerk (users, roles, sessions)
  - Payments: Razorpay checkout/success flows
- Included team features: admin UI, reporting, community leaderboard, AI assistant integration

## 🔧 Features included

- landing website + SEO-friendly pages
- courses listing, course details, lesson playback
- user dashboard (progress, purchases, profile)
- instructor course creation/editor, curriculum builder
- admin area (user management, course management, analytics)
- enrollment and purchase flow
- certificate modal + achievement tracking
- global auth and role guard (`AdminGuard`)
- full-stack API with backend routes and frontend client libs

## 📁 Repo overview

- `app/` website routes, static/dynamic pages, auth flows
- `components/` reusable UI primitives, LMS modules, admin widgets
- `lib/` application helpers, API client wrappers, utils
- `hooks/` UI hooks (mobile detection)
- `backend/` separate backend service code with routes, Prisma, config
- `clerk-nextjs/` Clerk-specific example integration and agent docs
- `public/` assets and static media

## 🛠️ Setup and local development

1. clone repository
2. install dependencies

```bash
cd e:\PROJECTS\LMS
npm install
# or pnpm install
```

3. configure environment files

- Root: `.env.local`
- Backend: `backend/.env` (as needed)

Common vars:

- `NEXT_PUBLIC_CLERK_FRONTEND_API`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXTAUTH_URL` / `APP_URL` as needed

4. run database migrations and seed

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. run app(s)

```bash
npm run dev
# or
pnpm dev
```

And backend (if separate server needed):

```bash
cd backend
npm run dev
```

6. open http://localhost:3000

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) with `@testing-library/react` for unit and component tests.

```bash
# Run all tests once
npm run test

# Run in watch mode (re-runs on save)
npm run test:watch
```

Test files live alongside the source code in `__tests__/` directories:
- `src/lib/__tests__/course-utils.test.ts` — course merge/union logic
- `src/lib/__tests__/backend-client.test.ts` — URL resolution + error extraction
- `src/lib/__tests__/format.test.ts` — currency, date, and text formatting utils

Add new tests in the same `__tests__/` folder next to the module being tested.

## 📦 Scripts

- `npm run dev` - start Next.js local server (Turbopack)
- `npm run build` - build production app
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run test` - run Vitest unit tests
- `npm run test:watch` - run Vitest in watch mode
- `npm run format` - run Prettier if configured

## 🌍 Environment Validation

The app validates required environment variables at startup using Zod (`src/lib/env.ts`).
If a required variable is missing in production, the app will throw and fail to start.
In development, a warning is printed so local workflows are not blocked.

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk frontend API key

Optional variables:
- `NEXT_PUBLIC_API_URL` — Backend base URL (defaults to `http://localhost:4000`)
- `NEXT_PUBLIC_APP_URL` — Canonical app URL

## 🛡️ Error Boundaries

Use `<ErrorBoundary>` from `@/components/ui/error-boundary` to isolate UI sections
that might fail (e.g. API-driven widgets):

```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary";

<ErrorBoundary>
  <CoursePlayer />
</ErrorBoundary>
```

Or use the HOC:

```tsx
import { withErrorBoundary } from "@/components/ui/error-boundary";

const SafeCoursePlayer = withErrorBoundary(CoursePlayer);
```

## 📚 Architecture notes

- `src/app` for routes and layouts
- `components/*` for presentational and container components
- `backend/src/routes/` for authenticated APIs — see [`backend/ROUTES.md`](./backend/ROUTES.md) for full API docs
- `prisma/schema.prisma` for data models
- `backend/src/lib/prisma.ts` for Prisma client singleton
- `backend/src/lib/logger.ts` for structured backend logging (JSON in prod, coloured in dev)
- `src/lib/env.ts` for typed, validated environment variables
- `src/lib/utils/format.ts` for shared formatting utilities (currency, dates, counts)
- `students` and `instructors` roles controlled via Clerk custom claims

## Project Structure

```bash
├── .npmrc
├── clerk-nextjs/ 
    ├── app/ 
    │   ├── favicon.ico
    │   ├── globals.css 
    │   ├── layout.tsx 
    │   └── page.tsx 
    ├── public/ 
    │   ├── vercel.svg
    │   ├── window.svg
    │   ├── file.svg
    │   ├── globe.svg 
    │   └── next.svg 
    ├── postcss.config.mjs
    ├── next.config.ts
    ├── eslint.config.mjs 
    ├── package.json 
    ├── .gitignore 
    ├── tsconfig.json 
    └── README.md 
├── src/ 
    ├── components/ 
    │   ├── lms/ 
    │   │   ├── CourseDesignCard.tsx
    │   │   ├── ThemeToggle.tsx 
    │   │   ├── SimplePage.tsx 
    │   │   └── TrustedBySectionPremium.tsx 
    │   ├── ui/ 
    │   │   ├── aspect-ratio.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── spinner.tsx
    │   │   ├── label.tsx 
    │   │   ├── separator.tsx 
    │   │   ├── textarea.tsx 
    │   │   ├── progress.tsx 
    │   │   ├── collapsible.tsx 
    │   │   ├── kbd.tsx 
    │   │   ├── input.tsx 
    │   │   ├── sonner.tsx 
    │   │   ├── switch.tsx 
    │   │   ├── avatar.tsx 
    │   │   ├── checkbox.tsx 
    │   │   ├── radio-group.tsx 
    │   │   ├── hover-card.tsx 
    │   │   ├── toggle.tsx 
    │   │   ├── badge.tsx 
    │   │   ├── popover.tsx 
    │   │   ├── alert.tsx 
    │   │   ├── scroll-area.tsx 
    │   │   ├── tooltip.tsx 
    │   │   ├── tabs.tsx 
    │   │   ├── resizable.tsx 
    │   │   ├── slider.tsx 
    │   │   ├── accordion.tsx 
    │   │   ├── card.tsx 
    │   │   ├── button.tsx 
    │   │   ├── button-group.tsx 
    │   │   ├── input-otp.tsx 
    │   │   ├── toggle-group.tsx 
    │   │   ├── breadcrumb.tsx 
    │   │   ├── empty.tsx 
    │   │   ├── table.tsx 
    │   │   ├── animated-theme-toggler.tsx 
    │   │   └── pagination.tsx 
    │   ├── theme/ 
    │   │   └── ThemeProviderWrapper.tsx
    │   ├── auth/ 
    │   │   └── ClerkProviderWrapper.tsx 
    │   └── admin/ 
    │   │   └── AdminGuard.tsx 
    ├── app/ 
    │   ├── icon.png
    │   ├── favicon.ico
    │   ├── global-error.tsx
    │   ├── legal/ 
    │   │   ├── privacy/ 
    │   │   │   └── page.tsx
    │   │   ├── cookies/ 
    │   │   │   └── page.tsx
    │   │   └── terms/ 
    │   │   │   └── page.tsx
    │   ├── demo/ 
    │   │   └── page.tsx
    │   ├── sign-in/ 
    │   │   └── page.tsx 
    │   ├── support/ 
    │   │   └── page.tsx 
    │   ├── page.tsx 
    │   ├── courses/ 
    │   │   └── [slug]/ 
    │   │   │   └── page.tsx 
    │   ├── admin/ 
    │   │   └── layout.tsx 
    │   ├── auth/ 
    │   │   ├── sign-up/ 
    │   │   │   └── [[...sign-up]]/ 
    │   │   │   │   └── page.tsx 
    │   │   └── sign-in/ 
    │   │   │   └── [[...sign-in]]/ 
    │   │   │       └── page.tsx 
    │   └── layout.tsx 
    ├── lib/ 
    │   ├── utils.ts
    │   ├── history-api.ts 
    │   ├── settings-api.ts 
    │   ├── backend-client.ts 
    │   └── course-utils.ts 
    ├── hooks/ 
    │   └── use-mobile.ts 
    └── middleware.ts 
├── public/ 
    ├── favicon.png
    ├── og-image.png
    ├── images/ 
    │   └── instructors/ 
    │   │   ├── gunjan_real.jpg
    │   │   └── chirantan_real.jpg
    ├── vercel.svg
    ├── window.svg
    ├── file.svg
    ├── marquee_images/
    │   ├── colored/ 
    │   │   ├── netflix-ar21.svg 
    │   │   ├── ebay-ar21.svg 
    │   │   ├── stripe-ar21.svg 
    │   │   ├── ibm-ar21.svg 
    │   │   ├── google-ar21.svg 
    │   │   ├── dropbox-ar21.svg 
    │   │   ├── gitlab-ar21.svg 
    │   │   ├── apple-ar21.svg 
    │   │   ├── framer-ar21.svg 
    │   │   ├── spotify-ar21.svg 
    │   │   ├── microsoft-ar21.svg 
    │   │   ├── airbnb-ar21.svg 
    │   │   ├── amazon-ar21.svg 
    │   │   ├── paypal-ar21.svg 
    │   │   └── docker-ar21.svg 
    │   ├── 04.svg 
    │   ├── 19.svg 
    │   ├── 05.svg 
    │   ├── 14.svg 
    │   ├── 08.svg 
    │   ├── 10.svg 
    │   ├── 18.svg 
    │   ├── 02.svg 
    │   └── 09.svg 
    ├── globe.svg 
    └── next.svg 
├── postcss.config.mjs
├── .gayen/ 
    ├── orchids.json
    └── files
├── backend/ 
    ├── .env.example
    ├── dist/ 
    │   ├── lib/ 
    │   │   ├── prisma.js
    │   │   └── auth.js 
    │   └── config/ 
    │   │   └── env.js 
    ├── .gitignore
    ├── tsconfig.json
    ├── src/ 
    │   ├── lib/ 
    │   │   ├── prisma.ts
    │   │   └── auth.ts 
    │   ├── config/ 
    │   │   └── env.ts 
    │   └── routes/ 
    │   │   ├── settings.ts 
    │   │   ├── reviews.ts 
    │   │   ├── users.ts 
    │   │   ├── accomplishments.ts 
    │   │   ├── history.ts 
    │   │   └── access.ts 
    ├── package.json 
    └── README.md 
├── .gitattributes
├── components.json 
├── .gitignore 
├── tsconfig.json 
├── next.config.ts 
├── eslint.config.mjs 
└── package.json 
```

## 🤝 Contributing

1. create feature branch
2. open PR with summary + testing rundown
3. follow linting and commit conventions

## 📝 License

MIT Standard License

---
