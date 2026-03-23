import SimplePage from "@/components/lms/SimplePage";

export default function SignInPage() {
  return (
    <SimplePage
      title="Sign In"
      description="Welcome back. Sign in to continue your learning roadmap, access your courses, and track progress."
      ctaLabel="Create New Account"
      ctaHref="/auth/sign-up"
    />
  );
}

