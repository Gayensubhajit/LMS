import { Field, ID, Int, ObjectType } from "type-graphql";
import { CourseLevel } from "@prisma/client";

@ObjectType()
export class CourseType {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  title!: string;

  @Field()
  shortDescription!: string;

  @Field()
  longDescription!: string;

  @Field()
  category!: string;

  @Field(() => String)
  level!: CourseLevel;

  @Field()
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

  @Field()
  isFree!: boolean;

  @Field()
  isPublished!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
