import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses-data";
import CourseDetailsClient from "@/components/lms/CourseDetailsClient";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return notFound();

  return <CourseDetailsClient course={course} />;
}

