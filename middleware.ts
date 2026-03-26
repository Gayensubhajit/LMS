import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Group matchers for clarity and scale
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sing-up(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/my-courses(.*)",
  "/settings(.*)",
  "/accomplishments(.*)",
  "/support(.*)",
  "/course/(.*)", // PROTECT SPECIFIC COURSE-IDs, Keeps /course public
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect specific routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
