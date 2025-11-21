export interface AnalysisResult {
  skills: {
    matched: string[];
    missing: string[];
    additional: string[];
    overallScore: number;
  };
  experience: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  education: {
    score: number;
    relevance: string;
    recommendations: string[];
  };
  overallScore: number;
}
