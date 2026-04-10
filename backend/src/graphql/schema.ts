import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { CourseResolver } from "./resolvers/CourseResolver.js";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [CourseResolver],
    emitSchemaFile: true,
    validate: false,
  });
};
