import { Prisma } from '@prisma/client';

const quizWithRelatedTables = Prisma.validator<Prisma.QuizDefaultArgs>()({
  include: {
    questions: {
      include: {
        answers: true,
      },
    },
    results: true,
  },
});

export type QuizWithRelatedTables = Prisma.QuizGetPayload<
  typeof quizWithRelatedTables
>;

const questionsWithRelatedTables =
  Prisma.validator<Prisma.QuestionDefaultArgs>()({
    include: {
      answers: true,
    },
  });

export type QuestionsWithRelatedTables = Prisma.QuestionGetPayload<
  typeof questionsWithRelatedTables
>;
