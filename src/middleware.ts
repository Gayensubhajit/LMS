import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define strictly public routes (Landing page, Auth, Webhooks)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/instructors(.*)",
  "/auth(.*)",
  "/auth/(.*)",
  "/courses(.*)",
  "/roadmap(.*)",
  "/features(.*)",
  "/legal(.*)",
  "/demo(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If it's NOT a public route, require authentication
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
