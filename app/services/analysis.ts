import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisSection {
  summary: string;
  recommendations: string;
  score?: number;
}

interface AnalysisResult {
  skills: AnalysisSection;
  experience: AnalysisSection;
  education: AnalysisSection;
  overallScore: number;
}

// Simplified prompts that return markdown instead of JSON
const ANALYSIS_PROMPTS = {
  skills: (content: string, jobRole: string) => `
    You are an expert technical recruiter evaluating a CV for a ${jobRole} opening.

    Output MUST follow this structure:

    **Technical Skills**
    * Skill Name — Short rationale (may mention inferred context)
    * (repeat for at least 6 skills, prioritising concrete technologies/tools)

    Rules:
    - Extract explicit skills first.
    - If skills are implied (e.g. "built dashboards with React"), infer "React", "Javascript" etc.
    - Never output placeholders like "Unspecified" or "Not provided".
    - Prefer singular nouns (e.g. "REST APIs", "AWS Lambda", "Next.js", "CI/CD").
    - Keep each rationale under 60 characters.

    **1. Key skills aligned with job requirements**
    (3-4 bullet points, no placeholders)

    **2. Candidate's strengths**
    (3 concise bullets)

    **3. Critical missing skills**
    (only list actual gaps; if none, say "None noted.")

    **4. Actionable suggestions for improvement**
    (3 short steps)

    CV Content:
    ${content}`,

  experience: (content: string, jobRole: string) => `
    Assess the professional experience for a ${jobRole}.
    Provide concrete observations only—skip any "[Not Applicable]" placeholders.

    Structure:
    **Experience Overview**
    - Bullet with relevance summary
    - Bullet with quantified achievement (if present)
    - Bullet with improvement opportunity

    **Recommendations**
    - 2-3 bullets, each actionable and specific.

    If absolutely no experience info exists, write:
    "Experience information not provided."

    CV Content:
    ${content}`,

  education: (content: string, jobRole: string) => `
    Evaluate the education and certifications relevant to a ${jobRole}.

    Structure:
    **Education Summary**
    - [Institution Name] — [Degree/Certification] ([Year or Status])
    - Include GPA if above 3.5, honors, or key academic projects
    - Repeat for all educational entries

    **Enhancement Opportunities**
    - Suggest 2-3 missing certifications or courses relevant to the role
    - Be specific (e.g., "AWS Solutions Architect", "Certified Kubernetes Administrator")

    Rules:
    - Extract all degrees, diplomas, certifications, bootcamps, and courses mentioned
    - If GPA/honors are stated, include them
    - Do NOT emit placeholder text like "[Not Applicable]" or "Education information not provided"
    - If there truly is no education data at all, respond with:
      "No education details detected in the provided CV."

    CV Content:
    ${content}`,
};

export async function analyzeCVContent(
  content: string,
  jobRole: string,
  genAI: GoogleGenerativeAI
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
      // Helper function to process each analysis with retries
    const analyzeSection = async (
      prompt: string,
      retries = 3
    ): Promise<string> => {
      try {
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        return response.text();
      } catch (error) {
        if (retries > 0 && (error as any).message?.includes('429')) {
          const waitTime = Math.pow(2, 4 - retries) * 2000;
          console.log(`Rate limit hit. Retrying in ${waitTime/1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return analyzeSection(prompt, retries - 1);
        }
        // Try fallback model if primary fails with 404
        if ((error as any).message?.includes('404') || (error as any).message?.includes('not found')) {
           console.log("Primary model not found, trying fallback...");
           const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
           const result = await fallbackModel.generateContent([prompt]);
           const response = await result.response;
           return response.text();
        }
        throw error;
      }
    };

    // Analyze each section sequentially to avoid hitting rate limits
    const skillsAnalysis = await analyzeSection(ANALYSIS_PROMPTS.skills(content, jobRole));
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    const experienceAnalysis = await analyzeSection(ANALYSIS_PROMPTS.experience(content, jobRole));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const educationAnalysis = await analyzeSection(ANALYSIS_PROMPTS.education(content, jobRole));

    // Calculate simple scores based on content length and keyword presence
    const calculateScore = (content: string): number => {
      const keywords = ["excellent", "strong", "impressive", "good"];
      const score = keywords.reduce(
        (acc, word) => acc + (content.toLowerCase().includes(word) ? 5 : 0),
        50
      );
      return Math.min(100, Math.max(0, score));
    };

    const result: AnalysisResult = {
      skills: {
        summary: skillsAnalysis,
        recommendations: extractRecommendations(skillsAnalysis),
        score: calculateScore(skillsAnalysis),
      },
      experience: {
        summary: experienceAnalysis,
        recommendations: extractRecommendations(experienceAnalysis),
        score: calculateScore(experienceAnalysis),
      },
      education: {
        summary: educationAnalysis,
        recommendations: extractRecommendations(educationAnalysis),
        score: calculateScore(educationAnalysis),
      },
      overallScore: 0,
    };

    // Calculate overall score
    result.overallScore = Math.round(
      result.skills.score! * 0.4 +
        result.experience.score! * 0.4 +
        result.education.score! * 0.2
    );

    return {
      success: true,
      analysis: result,
    };
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return {
      success: false,
      message:
        "An error occurred while analyzing the CV. Please try again later.",
      error: (error as Error).message,
    };
  }
}

function extractRecommendations(content: string): string {
  const recommendationsSection =
    content.split("4.")[1] || content.split("Suggestions")[1] || "";
  return (
    recommendationsSection.trim() || "No specific recommendations provided."
  );
}
