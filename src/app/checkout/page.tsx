import { notFound } from "next/navigation";
import CheckoutClient from "@/components/lms/CheckoutClient";
import { getCourseBySlug } from "@/lib/courses-data";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const slug = params.slug ?? "";
  const course = getCourseBySlug(slug);
  if (!course) return notFound();

  const requestedPlan = params.plan;
  const initialPlan =
    requestedPlan === "3month" || requestedPlan === "6month" || requestedPlan === "1month"
      ? requestedPlan
      : "1month";

  return <CheckoutClient course={course} initialPlan={initialPlan} />;
}

