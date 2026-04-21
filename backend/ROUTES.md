# LMS Backend — API Routes Reference

All routes are prefixed by the backend base URL (e.g. `http://localhost:4000`).

Authentication is handled via Clerk. Protected routes require the `x-clerk-user-id` header to be set to a valid Clerk user ID.

---

## Auth / Role Legend

| Symbol | Meaning |
|--------|---------|
| 🔓 | Public — no auth required |
| 🔑 | Authenticated — any signed-in user |
| 🛡️ | Instructor or Admin |
| 👑 | Admin only |
| 💎 | Super Admin only |

---

## Courses `/courses`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/courses` | 🔓 | List all published courses. Supports `?category=`, `?level=`, `?q=` query params for filtering/search. |
| `GET` | `/courses/:slug` | 🔓 | Get a single published course by slug. Auto-creates a placeholder if not found in DB. |
| `GET` | `/courses/:slug/lessons` | 🔓 | Get full curriculum (sections + lessons) for a course. Returns empty sections if course not found. |

---

## Enrollments `/enrollments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/enrollments` | 🔑 | Create or update an enrollment. Body: `{ courseSlug, plan? }`. Plan values: `1month`, `3month`, `6month`, `plus`, `annual`, `teams`. |
| `GET` | `/enrollments/me` | 🔑 | List all enrollments for the current user. |
| `GET` | `/enrollments/check/:slug` | 🔑 | Check enrollment status for a specific course slug. Returns `{ enrolled, isDirectEnrolled, isPlusMember, isPendingPlus, isPendingDirect }`. |
| `DELETE` | `/enrollments/:id` | 🔑 | Delete an enrollment by ID (user can only delete their own). |

---

## Progress `/progress`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/progress` | 🔑 | Mark a lesson as complete/incomplete. Body: `{ lessonId, completed }`. |
| `GET` | `/progress/:courseSlug` | 🔑 | Get all completed lesson IDs for a course. |
| `GET` | `/progress/:courseSlug/summary` | 🔑 | Get aggregate progress (completed count, total lessons, % complete). |

---

## Dashboard `/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/dashboard` | 🔑 | Get the full student dashboard: active enrollments, recent activity, upcoming lessons, stats. |

---

## User Settings `/settings`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/settings` | 🔑 | Get the current user's profile and settings. |
| `PATCH` | `/settings` | 🔑 | Update profile fields (name, bio, avatar URL, preferences). |

---

## Users `/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/me` | 🔑 | Get the current authenticated user record. |
| `POST` | `/users/sync` | 🔑 | Sync Clerk user data into the database (upsert). |

---

## Reviews `/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/reviews/:courseSlug` | 🔓 | Get all approved reviews for a course. |
| `POST` | `/reviews/:courseSlug` | 🔑 | Submit a review for an enrolled course. Body: `{ rating, comment }`. |

---

## History `/history`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/history` | 🔑 | Get the user's recently viewed courses. |
| `POST` | `/history` | 🔑 | Record a course view. Body: `{ courseSlug }`. |

---

## Accomplishments `/accomplishments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/accomplishments` | 🔑 | Get all certificates and badges earned by the current user. |
| `POST` | `/accomplishments/certificate` | 🔑 | Generate/claim a certificate for a completed course. Body: `{ courseSlug }`. |

---

## Access `/access`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/access/:courseSlug` | 🔑 | Check if the current user has active access to a course (direct enrollment or Plus membership). |

---

## Payments `/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/payments/create-order` | 🔑 | Create a Razorpay order. Body: `{ courseSlug, plan }`. Returns `{ orderId, amount, currency }`. |
| `POST` | `/payments/verify` | 🔑 | Verify a Razorpay payment and activate enrollment. Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, courseSlug, plan }`. |
| `GET` | `/payments/history` | 🔑 | Get the user's payment history. |

---

## Quizzes `/quizzes`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/quizzes/:lessonId` | 🔑 | Get the quiz for a specific lesson. |
| `POST` | `/quizzes/:lessonId/submit` | 🔑 | Submit quiz answers. Body: `{ answers: string[] }`. |

---

## Notes `/notes`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/notes/:lessonId` | 🔑 | Get user's notes for a lesson. |
| `POST` | `/notes/:lessonId` | 🔑 | Save/update notes for a lesson. Body: `{ content }`. |

---

## Forums `/forums`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/forums/:courseSlug` | 🔑 | List all discussion threads for a course. |
| `POST` | `/forums/:courseSlug` | 🔑 | Create a new thread. Body: `{ title, body }`. |
| `POST` | `/forums/threads/:id/reply` | 🔑 | Reply to a thread. Body: `{ body }`. |

---

## AI Assistant `/ai`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ai/chat` | 🔑 | Send a message to the AI assistant. Body: `{ message, courseSlug? }`. Returns `{ reply }`. |

---

## Gamification `/gamification`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/gamification/leaderboard` | 🔓 | Get the global XP leaderboard (top 50). |
| `GET` | `/gamification/me` | 🔑 | Get the current user's XP, streak, level, and badges. |

---

## Recommendations `/recommendations`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/recommendations` | 🔑 | Get personalized course recommendations based on enrollment history. |

---

## Admin `/admin`

> All admin routes require `🛡️ Instructor` or higher, except where noted.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/admin/courses` | 🛡️ | List all courses (including unpublished). |
| `POST` | `/admin/courses` | 🛡️ | Create a new course. |
| `PATCH` | `/admin/courses/:id` | 🛡️ | Update a course by ID. |
| `GET` | `/admin/courses/:id/curriculum` | 🛡️ | Get full curriculum (sections + lessons). |
| `POST` | `/admin/courses/:id/sections` | 🛡️ | Add a new section to a course. |
| `PATCH` | `/admin/sections/:id` | 🛡️ | Update a section. |
| `DELETE` | `/admin/sections/:id` | 🛡️ | Delete a section. |
| `POST` | `/admin/sections/:id/lessons` | 🛡️ | Add a lesson to a section. |
| `PATCH` | `/admin/lessons/:id` | 🛡️ | Update a lesson. |
| `DELETE` | `/admin/lessons/:id` | 🛡️ | Delete a lesson. |
| `GET` | `/admin/users` | 👑 | List all platform users with enrollment counts. |
| `PATCH` | `/admin/users/:id/role` | 👑 | Update a user's role. Super Admin role requires `💎`. |

---

## Admin Analytics `/admin/analytics`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/admin/analytics/overview` | 👑 | Platform-wide stats: total users, revenue, enrollments, and active courses. |

---

## Clerk Webhook `/clerk-webhook`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/clerk-webhook` | Svix signature | Receives `user.created` and `user.updated` events from Clerk and syncs users into the database. |

---

## Standard Response Shape

All routes return JSON with the following conventions:

```json
// Success
{ "ok": true, "item": { ... } }
{ "ok": true, "items": [ ... ], "count": 42 }

// Error
{ "ok": false, "error": "Human-readable error message" }
```

HTTP status codes follow standard REST conventions: `200`, `201`, `400`, `401`, `403`, `404`, `500`.
