import { GoogleGenerativeAI } from "@google/generative-ai";

export const initializeGemini = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Prompts for different analysis aspects
const ANALYSIS_PROMPTS = {
  skills: `Analyze the following CV and identify:
1. Technical skills present
2. Missing critical skills for the specified role
3. Additional relevant skills
4. Skill level assessment
Provide response in JSON format:
{
  "matched": string[],
  "missing": string[],
  "additional": string[],
  "overallScore": number
}`,

  experience: `Analyze the work experience in this CV and provide:
1. Assessment of experience relevance
2. Quantifiable achievements
3. Areas for improvement
Provide response in JSON format:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[]
}`,

  education: `Evaluate the educational background and provide:
1. Relevance to role
2. Key academic achievements
3. Additional certification recommendations
Provide response in JSON format:
{
  "score": number,
  "relevance": string,
  "recommendations": string[]
}`,
};
