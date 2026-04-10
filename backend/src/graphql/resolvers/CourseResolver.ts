import { Query, Resolver, Arg } from "type-graphql";
import { CourseType } from "../types/Course.js";
import { prisma } from "../../lib/prisma.js";

@Resolver(CourseType)
export class CourseResolver {
  @Query(() => [CourseType])
  async courses(): Promise<CourseType[]> {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
    });
    return courses as unknown as CourseType[];
  }

  @Query(() => CourseType, { nullable: true })
  async course(@Arg("slug") slug: string): Promise<CourseType | null> {
    const course = await prisma.course.findUnique({
      where: { slug },
    });
    return course as unknown as CourseType | null;
  }
}
