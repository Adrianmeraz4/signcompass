
import { InferModel, InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

// userid
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  hashedPassword: text('password').notNull(),
});

//courses
export const courses = mysqlTable('courses', {
  id: serial('id').primaryKey(),
  
});
//quizzes
export const quizzes = mysqlTable('quizzes', {
  id: serial('id').primaryKey(),
  
});
//questions
export const questions = mysqlTable('questions', {
  id: serial('id').primaryKey(),
  quizId: int('quiz_id'),
  question: text('question'),
  answer: text('answer'),
});

export type User = InferSelectModel<typeof users>;
