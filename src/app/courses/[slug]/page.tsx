import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses-data";
import CourseDetailsClient from "@/components/lms/CourseDetailsClient";

import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) return { title: "Course Not Found" };

  return {
    title: course.title,
    description: course.shortDescription || `Master ${course.title} with EduNova's AI-guided roadmap.`,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [
        {
          url: `/og-image.png`, // placeholder for dynamic OG image
          width: 1200,
          height: 630,
          alt: course.title
        }
      ]
    }
  };
}

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

