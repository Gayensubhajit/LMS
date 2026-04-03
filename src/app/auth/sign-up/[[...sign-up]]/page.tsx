import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-14">
        <div className="max-w-xl w-full glass-card rounded-3xl border border-violet-500/20 p-8">
          <h1 className="text-3xl font-black text-white mb-3">Clerk not configured yet</h1>
          <p className="text-gray-400 mb-4">
            Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to enable Clerk auth.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-14">
      <SignUp
        path="/auth/sign-up"
        routing="path"
        signInUrl="/auth/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-white dark:bg-[#0f0f1a] border border-slate-200 dark:border-violet-500/20 shadow-none",
            headerTitle: "text-slate-900 dark:text-white",
            headerSubtitle: "text-slate-500 dark:text-gray-400",
            socialButtonsBlockButton:
              "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-violet-500/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10",
            formFieldInput:
              "bg-white dark:bg-white/5 border border-slate-200 dark:border-violet-500/20 text-slate-900 dark:text-white placeholder:text-gray-500",
            formButtonPrimary:
              "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white hover:opacity-95 shadow-lg shadow-blue-500/30 dark:shadow-none",
            footerActionLink: "text-blue-600 dark:text-violet-300 hover:text-blue-700 dark:hover:text-violet-200",
          },
        }}
      />
    </main>
  );
}
