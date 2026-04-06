import { notFound } from "next/navigation";
import { Metadata } from "next";
import CourseDetailsClient from "@/components/lms/CourseDetailsClient";
import { mergeCourse, type BackendCourse } from "@/lib/course-utils";

import { BACKEND_URL } from "@/lib/backend-client";

async function getCourse(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/courses/${slug}`, {
      next: { revalidate: 0 } // Always fetch fresh prices
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.ok && data.item) {
      return mergeCourse(data.item as BackendCourse);
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) return { title: "Course Not Found | EduNova" };

  return {
    title: `${course.title} | EduNova`,
    description: course.shortDescription || `Master ${course.title} with EduNova's AI-guided roadmap.`,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [
        {
          url: course.img || `/og-image.png`,
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
  const course = await getCourse(slug);
  
  if (!course) return notFound();

  return <CourseDetailsClient course={course} />;
}

