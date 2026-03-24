import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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
            href="/auth/sign-up"
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Go to Sign Up
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-14">
      <SignIn
        path="/auth/sign-in"
        routing="path"
        signUpUrl="/auth/sign-up"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-[#0f0f1a] border border-violet-500/20 shadow-none",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "bg-white/5 border border-violet-500/20 text-white hover:bg-white/10",
            formFieldInput:
              "bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500",
            formButtonPrimary:
              "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-95",
            footerActionLink: "text-violet-300 hover:text-violet-200",
          },
        }}
      />
    </main>
  );
}
