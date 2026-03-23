import SimplePage from "@/components/lms/SimplePage";

export default function CheckoutPage() {
  return (
    <SimplePage
      title="Checkout"
      description="You are one step away from enrollment. Confirm your course details and continue with secure checkout."
      ctaLabel="Continue to Sign Up"
      ctaHref="/auth/sign-up"
    />
  );
}

