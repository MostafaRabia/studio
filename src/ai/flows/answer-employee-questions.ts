'use server';

/**
 * @fileOverview An AI agent that answers employee questions using a curated knowledge base.
 *
 * - answerEmployeeQuestions - A function that answers employee questions.
 * - AnswerEmployeeQuestionsInput - The input type for the answerEmployeeQuestions function.
 * - AnswerEmployeeQuestionsOutput - The return type for the answerEmployeeQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerEmployeeQuestionsInputSchema = z.object({
  question: z.string().describe('The question the employee is asking.'),
});
export type AnswerEmployeeQuestionsInput = z.infer<
  typeof AnswerEmployeeQuestionsInputSchema
>;

const AnswerEmployeeQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the employee question.'),
});
export type AnswerEmployeeQuestionsOutput = z.infer<
  typeof AnswerEmployeeQuestionsOutputSchema
>;

export async function answerEmployeeQuestions(
  input: AnswerEmployeeQuestionsInput
): Promise<AnswerEmployeeQuestionsOutput> {
  return answerEmployeeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerEmployeeQuestionsPrompt',
  input: {schema: AnswerEmployeeQuestionsInputSchema},
  output: {schema: AnswerEmployeeQuestionsOutputSchema},
  prompt: `You are an HR expert. Answer the following question using your knowledge of company policies and HR procedures.\n\nQuestion: {{{question}}}`,
});

const answerEmployeeQuestionsFlow = ai.defineFlow(
  {
    name: 'answerEmployeeQuestionsFlow',
    inputSchema: AnswerEmployeeQuestionsInputSchema,
    outputSchema: AnswerEmployeeQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
