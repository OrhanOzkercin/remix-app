import { prisma } from "~/db.server";

export interface TestResultCreate {
  wpm: number;
  accuracy: number;
  correctWords: number;
  totalTypedWords: number;
  difficulty: "easy" | "medium" | "hard";
}

export async function createTestResult(result: TestResultCreate) {
  return prisma.testResult.create({
    data: {
      wpm: result.wpm,
      accuracy: result.accuracy,
      correctWords: result.correctWords,
      totalTypedWords: result.totalTypedWords,
      difficulty: result.difficulty,
      createdAt: new Date(),
    },
  });
}

export async function getRecentTestResults(limit = 10) {
  return prisma.testResult.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

export async function getBestResults() {
  return prisma.testResult.findMany({
    orderBy: {
      wpm: "desc",
    },
    take: 5,
  });
}
