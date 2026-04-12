import { Field, ID, Int, ObjectType } from "type-graphql";
import { CourseLevel } from "@prisma/client";

@ObjectType()
export class CourseType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  shortDescription!: string;

  @Field(() => String)
  longDescription!: string;

  @Field(() => String)
  category!: string;

  @Field(() => String)
  level!: CourseLevel;

  @Field(() => String)
  instructorName!: string;

  @Field(() => String, { nullable: true })
  previewVideoUrl?: string | null;

  @Field(() => Int)
  oneMonthPrice!: number;

  @Field(() => Int)
  threeMonthPrice!: number;

  @Field(() => Int)
  sixMonthPrice!: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;

  @Field(() => Boolean)
  isFree!: boolean;

  @Field(() => Boolean)
  isPublished!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
