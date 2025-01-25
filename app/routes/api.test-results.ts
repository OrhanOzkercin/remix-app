import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createTestResult } from "~/models/test-result.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const result = await request.json();
    console.log("Received data:", result);

    // Convert values to numbers and validate
    const wpm = Number(result.wpm);
    const accuracy = Number(result.accuracy);
    const correctWords = Number(result.correctWords);
    const totalTypedWords = Number(result.totalTypedWords);
    const difficulty = result.difficulty;

    // Validate all fields
    if (Number.isNaN(wpm) || Number.isNaN(accuracy) || 
        Number.isNaN(correctWords) || Number.isNaN(totalTypedWords) || 
        !difficulty) {
      console.error("Invalid data received:", {
        wpm,
        accuracy,
        correctWords,
        totalTypedWords,
        difficulty
      });
      return json({ error: "Invalid data received" }, { status: 400 });
    }

    // Save to database
    console.log("Saving result:", {
      wpm,
      accuracy,
      correctWords,
      totalTypedWords,
      difficulty
    });

    const savedResult = await createTestResult({
      wpm,
      accuracy,
      correctWords,
      totalTypedWords,
      difficulty
    });

    console.log("Successfully saved result:", savedResult);
    return json({ success: true, result: savedResult });

  } catch (error) {
    console.error("Failed to save test result:", error);
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 500 });
    }
    return json({ error: "An unknown error occurred" }, { status: 500 });
  }
}; 