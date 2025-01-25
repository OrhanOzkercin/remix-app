import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/db.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { wpm, accuracy, correctWords, totalTypedWords, difficulty } = data;

    // Validate required fields
    if (!wpm || !accuracy || !correctWords || !totalTypedWords || !difficulty) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to database
    const result = await prisma.testResult.create({
      data: {
        wpm: Number(wpm),
        accuracy: Number(accuracy),
        correctWords: Number(correctWords),
        totalTypedWords: Number(totalTypedWords),
        difficulty: difficulty.toLowerCase(),
      },
    });

    return json({ success: true, result });
  } catch (error) {
    console.error("Failed to save test result:", error);
    return json({ error: "Failed to save test result" }, { status: 500 });
  }
};