# LMS Platform (Next.js + Node + Prisma)

Welcome to the LMS project — a modern online learning platform implementation built with Next.js (App Router), Clerk auth, Stripe checkout, and a backend powered by Node + Express-like routes and Prisma + PostgreSQL.

## 🚀 Why this project is awesome

- Complete full-stack LMS from marketing pages to student dashboards, instructor tools, and admin controls
- Supports video courses, progress tracking, achievements, certifications, and enrollment logic
- Built with best-in-class dev stack:
  - Frontend: Next.js 14+, TypeScript, Tailwind CSS, React Server Components
  - Backend: Node, TypeScript, Prisma ORM, REST-like routes
  - Auth: Clerk (users, roles, sessions)
  - Payments: Stripe checkout/success flows
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

No tests are included by default in this starter. Add test setup with Jest/Playwright/Cypress as needed.

## 📦 Scripts

- `npm run dev` - start Next.js local server
- `npm run build` - build production app
- `npm run start` - run production server
- `npm run lint` - run eslint
- `npm run format` - run prettier if configured

## 📚 Architecture notes

- `src/app` for routes and layouts
- `components/*` for presentational and container components
- `backend/src/routes/` for authenticated APIs
- `prisma/schema.prisma` for data models
- `backend/src/lib/prisma.ts` for Prisma client singleton
- `students` and `instructors` roles controlled via Clerk custom claims

## Project Structure

```bash
├── .npmrc
├── clerk-nextjs/ (3500 tokens)
    ├── CLAUDE.md
    ├── app/ (1200 tokens)
    │   ├── favicon.ico
    │   ├── globals.css (200 tokens)
    │   ├── layout.tsx (200 tokens)
    │   └── page.tsx (700 tokens)
    ├── public/ (800 tokens)
    │   ├── vercel.svg
    │   ├── window.svg
    │   ├── file.svg
    │   ├── globe.svg (200 tokens)
    │   └── next.svg (300 tokens)
    ├── postcss.config.mjs
    ├── next.config.ts
    ├── AGENTS.md
    ├── eslint.config.mjs (200 tokens)
    ├── .gitignore (200 tokens)
    ├── package.json (200 tokens)
    ├── tsconfig.json (200 tokens)
    └── README.md (400 tokens)
├── src/ (27300 tokens)
    ├── app/ (4400 tokens)
    │   ├── favicon.ico
    │   ├── global-error.tsx
    │   ├── legal/ (300 tokens)
    │   │   ├── privacy/ (100 tokens)
    │   │   │   └── page.tsx
    │   │   ├── cookies/ (100 tokens)
    │   │   │   └── page.tsx
    │   │   └── terms/ (100 tokens)
    │   │   │   └── page.tsx
    │   ├── demo/ (100 tokens)
    │   │   └── page.tsx
    │   ├── admin/ (200 tokens)
    │   │   └── layout.tsx (200 tokens)
    │   ├── sign-in/ (200 tokens)
    │   │   └── page.tsx (200 tokens)
    │   ├── support/ (300 tokens)
    │   │   └── page.tsx (300 tokens)
    │   ├── page.tsx (300 tokens)
    │   ├── courses/ (500 tokens)
    │   │   └── [slug]/ (500 tokens)
    │   │   │   └── page.tsx (500 tokens)
    │   ├── auth/ (1000 tokens)
    │   │   ├── sign-up/ (500 tokens)
    │   │   │   └── [[...sign-up]]/ (500 tokens)
    │   │   │   │   └── page.tsx (500 tokens)
    │   │   └── sign-in/ (500 tokens)
    │   │   │   └── [[...sign-in]]/ (500 tokens)
    │   │   │       └── page.tsx (500 tokens)
    │   ├── api/ (600 tokens)
    │   │   └── assistant/ (600 tokens)
    │   │   │   └── route.ts (600 tokens)
    │   └── layout.tsx (700 tokens)
    ├── lib/ (2300 tokens)
    │   ├── utils.ts
    │   ├── history-api.ts (200 tokens)
    │   ├── settings-api.ts (200 tokens)
    │   ├── backend-client.ts (300 tokens)
    │   ├── course-utils.ts (700 tokens)
    │   └── utils/ (800 tokens)
    │   │   └── currency.ts (800 tokens)
    ├── components/ (20200 tokens)
    │   ├── ui/ (18200 tokens)
    │   │   ├── aspect-ratio.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── spinner.tsx
    │   │   ├── label.tsx (200 tokens)
    │   │   ├── textarea.tsx (200 tokens)
    │   │   ├── separator.tsx (200 tokens)
    │   │   ├── progress.tsx (200 tokens)
    │   │   ├── collapsible.tsx (200 tokens)
    │   │   ├── kbd.tsx (200 tokens)
    │   │   ├── input.tsx (300 tokens)
    │   │   ├── sonner.tsx (300 tokens)
    │   │   ├── switch.tsx (300 tokens)
    │   │   ├── checkbox.tsx (300 tokens)
    │   │   ├── avatar.tsx (300 tokens)
    │   │   ├── radio-group.tsx (400 tokens)
    │   │   ├── hover-card.tsx (400 tokens)
    │   │   ├── toggle.tsx (400 tokens)
    │   │   ├── badge.tsx (400 tokens)
    │   │   ├── popover.tsx (400 tokens)
    │   │   ├── scroll-area.tsx (400 tokens)
    │   │   ├── alert.tsx (400 tokens)
    │   │   ├── tooltip.tsx (500 tokens)
    │   │   ├── tabs.tsx (500 tokens)
    │   │   ├── resizable.tsx (500 tokens)
    │   │   ├── slider.tsx (500 tokens)
    │   │   ├── accordion.tsx (500 tokens)
    │   │   ├── card.tsx (500 tokens)
    │   │   ├── button.tsx (600 tokens)
    │   │   ├── button-group.tsx (600 tokens)
    │   │   ├── input-otp.tsx (600 tokens)
    │   │   ├── toggle-group.tsx (600 tokens)
    │   │   ├── empty.tsx (700 tokens)
    │   │   ├── breadcrumb.tsx (700 tokens)
    │   │   ├── table.tsx (700 tokens)
    │   │   ├── pagination.tsx (800 tokens)
    │   │   ├── form.tsx (1000 tokens)
    │   │   ├── alert-dialog.tsx (1000 tokens)
    │   │   ├── dialog.tsx (1000 tokens)
    │   │   └── sheet.tsx (1100 tokens)
    │   ├── auth/ (100 tokens)
    │   │   └── ClerkProviderWrapper.tsx
    │   ├── theme/ (100 tokens)
    │   │   └── ThemeProviderWrapper.tsx
    │   ├── lms/ (1300 tokens)
    │   │   ├── ThemeToggle.tsx (200 tokens)
    │   │   ├── SimplePage.tsx (400 tokens)
    │   │   └── TrustedBySectionPremium.tsx (700 tokens)
    │   └── admin/ (500 tokens)
    │   │   └── AdminGuard.tsx (500 tokens)
    ├── hooks/ (200 tokens)
    │   └── use-mobile.ts (200 tokens)
    └── middleware.ts (200 tokens)
├── postcss.config.mjs
├── public/ (6800 tokens)
    ├── vercel.svg
    ├── window.svg
    ├── file.svg
    ├── globe.svg (200 tokens)
    ├── marquee_images/ (6000 tokens)
    │   ├── 04.svg (300 tokens)
    │   ├── 19.svg (400 tokens)
    │   ├── 05.svg (400 tokens)
    │   ├── 14.svg (500 tokens)
    │   ├── 08.svg (500 tokens)
    │   ├── 10.svg (500 tokens)
    │   ├── 18.svg (700 tokens)
    │   ├── 02.svg (800 tokens)
    │   ├── 09.svg (900 tokens)
    │   └── 15.svg (1000 tokens)
    └── next.svg (300 tokens)
├── .gayen/ (200 tokens)
    ├── orchids.json
    └── files/ (100 tokens)
    │   └── claude-1774118190093-2d42kd/ (100 tokens)
    │       └── 1-image_1774116869349-resized-1774118081363.jpg
├── backend/ (8700 tokens)
    ├── .env.example
    ├── dist/ (2400 tokens)
    │   ├── lib/ (300 tokens)
    │   │   ├── prisma.js
    │   │   └── auth.js (200 tokens)
    │   ├── config/ (200 tokens)
    │   │   └── env.js (200 tokens)
    │   └── routes/ (1900 tokens)
    │   │   ├── access.js (900 tokens)
    │   │   └── clerk-webhook.js (1000 tokens)
    ├── .gitignore
    ├── tsconfig.json
    ├── src/ (4700 tokens)
    │   ├── lib/ (400 tokens)
    │   │   ├── prisma.ts
    │   │   └── auth.ts (300 tokens)
    │   ├── config/ (200 tokens)
    │   │   └── env.ts (200 tokens)
    │   └── routes/ (4100 tokens)
    │   │   ├── settings.ts (500 tokens)
    │   │   ├── users.ts (500 tokens)
    │   │   ├── accomplishments.ts (600 tokens)
    │   │   ├── history.ts (600 tokens)
    │   │   ├── access.ts (900 tokens)
    │   │   └── courses.ts (1000 tokens)
    ├── package.json (300 tokens)
    └── README.md (1000 tokens)
├── components.json (200 tokens)
├── .gitignore (200 tokens)
├── tsconfig.json (200 tokens)
├── next.config.ts (200 tokens)
├── eslint.config.mjs (300 tokens)
├── README.md (400 tokens)
└── package.json (800 tokens)
```

## 🤝 Contributing

1. create feature branch
2. open PR with summary + testing rundown
3. follow linting and commit conventions

## 📝 License

MIT (or update as needed for your project context)

---
