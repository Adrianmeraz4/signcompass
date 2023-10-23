"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = exports.quizzes = exports.courses = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
// userid
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    username: (0, mysql_core_1.text)('username'),
    hashedPassword: (0, mysql_core_1.text)('password').notNull(),
});
//courses
exports.courses = (0, mysql_core_1.mysqlTable)('courses', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
});
//quizzes
exports.quizzes = (0, mysql_core_1.mysqlTable)('quizzes', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
});
//questions
exports.questions = (0, mysql_core_1.mysqlTable)('questions', {
    id: (0, mysql_core_1.serial)('id').primaryKey(),
    quizId: (0, mysql_core_1.int)('quiz_id'),
    question: (0, mysql_core_1.text)('question'),
    answer: (0, mysql_core_1.text)('answer'),
});
