'use server';
/**
 * @fileOverview Provides AI-generated high-level explanations of common deepfake and image manipulation indicators.
 *
 * - aiDeepfakeIndicatorExplanation - A function that generates explanations for deepfake indicators.
 * - AiDeepfakeIndicatorExplanationInput - The input type for the aiDeepfakeIndicatorExplanation function.
 * - AiDeepfakeIndicatorExplanationOutput - The return type for the aiDeepfakeIndicatorExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDeepfakeIndicatorExplanationInputSchema = z.string().describe('An optional query for specific types of deepfake indicators, e.g., "facial features" or "lighting inconsistencies". If empty, a general explanation will be provided.');
export type AiDeepfakeIndicatorExplanationInput = z.infer<typeof AiDeepfakeIndicatorExplanationInputSchema>;

const AiDeepfakeIndicatorExplanationOutputSchema = z.object({
  explanation: z.string().describe('A high-level explanation of common deepfake and image manipulation indicators.'),
});
export type AiDeepfakeIndicatorExplanationOutput = z.infer<typeof AiDeepfakeIndicatorExplanationOutputSchema>;

export async function aiDeepfakeIndicatorExplanation(input: AiDeepfakeIndicatorExplanationInput): Promise<AiDeepfakeIndicatorExplanationOutput> {
  return aiDeepfakeIndicatorExplanationFlow(input);
}

const aiDeepfakeIndicatorExplanationPrompt = ai.definePrompt({
  name: 'aiDeepfakeIndicatorExplanationPrompt',
  input: {schema: AiDeepfakeIndicatorExplanationInputSchema},
  output: {schema: AiDeepfakeIndicatorExplanationOutputSchema},
  prompt: `You are an expert in digital forensics and deepfake detection.
Your task is to provide a high-level explanation of common indicators that suggest an image might be a deepfake or has been manipulated. Focus on general types of patterns that contribute to detected results.

If the user provides a specific query, tailor the explanation to that topic. Otherwise, provide a general overview.

Here are some categories of indicators to consider, but do not limit yourself to these:
- Inconsistencies in facial features (e.g., asymmetry, unusual blinks, unnatural skin texture).
- Lighting and shadow discrepancies that do not match the scene.
- Unnatural edges, blurring, or artifacts around objects or subjects.
- Pixelation or compression artifacts that are inconsistent across the image.
- Unusual background elements or repetition.

User Query: {{{this}}}

Provide the explanation in a clear, concise, and easy-to-understand manner.`,
});

const aiDeepfakeIndicatorExplanationFlow = ai.defineFlow(
  {
    name: 'aiDeepfakeIndicatorExplanationFlow',
    inputSchema: AiDeepfakeIndicatorExplanationInputSchema,
    outputSchema: AiDeepfakeIndicatorExplanationOutputSchema,
  },
  async input => {
    const {output} = await aiDeepfakeIndicatorExplanationPrompt(input);
    return output!;
  }
);
