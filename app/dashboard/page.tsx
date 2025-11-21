"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Download, CheckCircle2, XCircle, Star } from "lucide-react";

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

const shouldSkipLine = (line: string) => {
  const sanitized = line.toLowerCase();
  return (
    sanitized.includes("not applicable") ||
    sanitized.includes("not provided") ||
    sanitized.includes("no data") ||
    sanitized.includes("details missing")
  );
};

const extractKeyPoints = (text: string): string[] => {
  const points: string[] = [];

  const lines = text.split("\n");
  for (const line of lines) {
    if (
      line.match(/^\*\*[0-9]+\.|^\*\s|^\*\*[A-Za-z]/) ||
      line.includes("* **")
    ) {
      const cleaned = line
        .replace(/^\*\*|\*\*/g, "")
        .replace(/^\* /g, "")
        .replace(/^\d+\.\s*/g, "")
        .trim();

      if (!shouldSkipLine(cleaned)) {
        points.push(cleaned);
      }
    }
  }

  return points.filter((point) => point.length > 0).slice(0, 4);
};

const extractRecommendations = (text: string): string[] => {
  const recommendations = text
    .split("\n")
    .filter((line) => line.includes("* **"))
    .map((line) => line.replace(/^\* \*\*|\*\*/g, "").trim());

  return recommendations.filter((rec) => rec.length > 0).slice(0, 3);
};

const ScoreCard = ({ score }: { score: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(
    0,
    Math.min(circumference, (score / 100) * circumference)
  );

  return (
    <Card className="relative overflow-hidden w-full bg-gradient-to-br from-primary/90 to-primary rounded-3xl text-primary-foreground shadow-2xl">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_60%)]" />
      <CardHeader className="space-y-1 relative z-10">
        <CardTitle className="text-xl md:text-2xl tracking-tight">
          Overall Score
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-base">
          CV Match Analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="15"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="currentColor"
                strokeWidth="15"
                fill="none"
                strokeDasharray={`${progress} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{score}%</span>
              <span className="text-sm uppercase tracking-widest opacity-80">
                Match
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionCard = ({
  title,
  section,
}: {
  title: string;
  section: AnalysisSection;
}) => {
  const keyPoints = extractKeyPoints(section.summary);
  const recommendations = extractRecommendations(section.recommendations);

  return (
    <Card className="w-full h-full border bg-white dark:bg-[#1b2132] shadow-sm hover:shadow-lg transition-all duration-200 rounded-3xl">
      <CardHeader className="border-b bg-gray-50/50 dark:bg-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </CardTitle>
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium text-muted-foreground">Match Score</span>
             <Badge variant={section.score! >= 70 ? "default" : "secondary"} className="text-base font-bold px-3 py-1">
                {section.score}%
             </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Key Observations</h3>
          <ul className="space-y-4">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <div className="mt-1 rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {recommendations.length > 0 && (
          <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-100 dark:border-yellow-900/20">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-500 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Star className="w-4 h-4" />
               Recommended Actions
            </h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


interface TechnicalSkill {
  name: string;
  context?: string;
}

const SkillsBreakdown = ({ summary }: { summary: string }) => {
  const extractSkillLines = (text: string): string[] => {
    // Try to find the "Technical Skills" section
    const sectionMatch = text.match(/\*\*Technical Skills\*\*([\s\S]*?)(?=\*\*|$)/i);
    let sectionText = sectionMatch ? sectionMatch[1] : text;
    
    // If no section found, try looking for just "Technical Skills" without stars
    if (!sectionMatch) {
         const simpleMatch = text.match(/Technical Skills:?([\s\S]*?)(?=\n\n|$)/i);
         if (simpleMatch) sectionText = simpleMatch[1];
    }

    // Extract bullet points
    return sectionText
      .split('\n')
      .map(line => line.trim())
      .filter(line => 
          (line.startsWith('*') || line.startsWith('-') || line.match(/^\d+\./)) && 
          !line.toLowerCase().includes('technical skills')
      )
      .map(line => line.replace(/^[\*\-]\s*|^\d+\.\s*/, '').trim())
      .filter(skill => skill.length > 0 && skill.toLowerCase() !== 'none' && skill.toLowerCase() !== 'n/a');
  };

  const rawSkillLines = extractSkillLines(summary);
  let technicalSkills: TechnicalSkill[] =
    rawSkillLines
      .filter((line) => !shouldSkipLine(line))
      .map((line) => {
        const [namePart, ...rest] = line.split(/—| - |:/);
        const name = namePart.trim();
        const context = rest.join("—").trim();
        return {
          name,
          context: context && context !== name ? context : undefined,
        };
      })
      .filter((skill) => skill.name.length > 0);

  // Fallback to extraction by known categories if no specific list found
  // (This preserves old behavior if the prompt response format varies)
  if (technicalSkills.length === 0) {
     const extractSkills = (text: string, category: string): TechnicalSkill[] => {
        const categoryRegex = new RegExp(`\\*\\*${category}:\\*\\*([^*]+)`);
        const match = text.match(categoryRegex);
        if (!match) return [];
    
        return match[1]
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
          .map((skill) => ({ name: skill }));
      };
      
      const programming = extractSkills(summary, "Programming Languages");
      const frontend = extractSkills(summary, "Frontend Development");
      const backend = extractSkills(summary, "Backend Development");
      technicalSkills = [...programming, ...frontend, ...backend];
  }

  const uniqueSkills: TechnicalSkill[] = [];
  const seen = new Set<string>();
  technicalSkills
    .filter((skill) => !!skill.name)
    .forEach((skill) => {
      const key = skill.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSkills.push(skill);
      }
    });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-4 text-lg tracking-tight">Technical Skills</h3>
        {uniqueSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {uniqueSkills.slice(0, 18).map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="group rounded-full border border-primary/15 bg-primary/10 px-4 py-2 flex flex-col min-w-[140px] hover:bg-primary/15 transition-colors"
              >
                <span className="text-sm font-semibold text-primary">{skill.name}</span>
                {skill.context && (
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {skill.context}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic p-4 bg-muted/30 rounded-lg border border-dashed text-center">
             No specific technical skills detected in this section. 
             <br/><span className="text-xs opacity-70">(Try analyzing again with the updated system)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AnalysisDashboard() {
  const [results, setResults] = React.useState<AnalysisResult | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedResults = localStorage.getItem("analysisResults");
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        console.log(parsedResults);
        
        setResults(parsedResults.analysis);
      }
    } catch (error) {
      console.error("Error loading analysis results:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = () => {
    // Implement PDF download logic here
    console.log("Download PDF clicked");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "CV Analysis Results",
          text: "Check out my CV analysis results!",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-4xl font-bold">
          Loading analysis results...
        </h1>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">No analysis results available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#050c1f] to-[#0d152a] text-white selection:bg-primary/30">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">Detailed insights and recommendations</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-full border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleDownload}
              className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Score and Technical Profile Grid */}
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
             <ScoreCard score={results.overallScore} />
          </div>
          <div className="md:col-span-8">
            <Card className="h-full border-none bg-white/50 dark:bg-white/5 shadow-2xl shadow-black/5 backdrop-blur-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">Technical Profile</CardTitle>
                        <CardDescription>Detected skills & technologies</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary rounded-full px-3">
                        {results.overallScore > 70 ? 'Strong Match' : 'Potential Match'}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <SkillsBreakdown summary={results.skills.summary} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="skills" className="w-full space-y-6">
          <div className="flex justify-center">
            <TabsList className="h-auto p-1 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
              <TabsTrigger value="skills" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                Skills Analysis
              </TabsTrigger>
              <TabsTrigger value="experience" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                Education
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="grid gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <TabsContent value="skills" className="m-0">
              <SectionCard title="Skills Assessment" section={results.skills} />
            </TabsContent>
            <TabsContent value="experience" className="m-0">
              <SectionCard title="Professional Experience" section={results.experience} />
            </TabsContent>
            <TabsContent value="education" className="m-0">
              <SectionCard title="Education & Certifications" section={results.education} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}