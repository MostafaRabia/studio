"use server";

import { answerEmployeeQuestions, type AnswerEmployeeQuestionsInput, type AnswerEmployeeQuestionsOutput } from "@/ai/flows/answer-employee-questions";

export async function getAiFaqAnswer(input: AnswerEmployeeQuestionsInput): Promise<AnswerEmployeeQuestionsOutput> {
  try {
    const result = await answerEmployeeQuestions(input);
    return result;
  } catch (error) {
    console.error("Error getting AI FAQ answer:", error);
    // It's better to return a structured error or throw a custom error
    // For now, returning a generic error message in the answer field
    return { answer: "Sorry, I encountered an error while processing your question. Please try again later." };
  }
}
