"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { FileUploader } from "@/components/file-uploader";
import { JobRoleSelect } from "@/components/job-role-select";
import { LocationSelect } from "@/components/location-select";
import { AnalysisProgress } from "@/components/analysis-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { initializeGemini } from "@/lib/gemini";
import { analyzeCVContent } from "../services/analysis";

type AnalysisStatus = "pending" | "processing" | "completed";

interface AnalysisStep {
  id: string;
  label: string;
  status: AnalysisStatus;
}

const analysisSteps: AnalysisStep[] = [
  { id: "upload", label: "Processing document", status: "pending" },
  { id: "scan", label: "Scanning for compatibility", status: "pending" },
  { id: "extract", label: "Extracting information", status: "pending" },
  { id: "analyze", label: "Analyzing content", status: "pending" },
  {
    id: "compare",
    label: "Comparing with job requirements",
    status: "pending",
  },
  { id: "generate", label: "Generating recommendations", status: "pending" },
];

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>(analysisSteps);

  const { toast } = useToast();
  const router = useRouter();

  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const updateStep = (stepId: string, status: AnalysisStatus) => {
    setSteps((current) =>
      current.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  function sanitizeContent(content: string) {
    // Strip out markdown headers
    return content.replace(/^(#{1,6})\s+/gm, "").trim();
  }


  const onSubmit = async () => {
    if (!file || !jobRole || !location) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);

      const content = await readFileContent(file);
      const sanitizedContent = sanitizeContent(content); // Sanitize content
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
      }

      const genAI = initializeGemini(apiKey);

      // Proceed with analyzing the sanitized content
      updateStep("upload", "processing");
      setProgress(20);

      updateStep("scan", "processing");
      setProgress(40);

      const results = await analyzeCVContent(sanitizedContent, jobRole, genAI);
      console.log(results);

      updateStep("extract", "processing");
      setProgress(60);

      updateStep("analyze", "processing");
      setProgress(80);

      localStorage.setItem("analysisResults", JSON.stringify(results));

      updateStep("generate", "completed");
      setProgress(100);

      toast({
        title: "Analysis Complete",
        description: "Your CV has been analyzed successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-center">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Analyze Your CV
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Get AI-powered insights to land your dream role
              </p>
            </div>

            <div className="hidden lg:block space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="text-xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">ATS Optimized</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    See how ATS systems read your CV
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Fast Analysis</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Instant feedback powered by AI
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Private & Secure</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Data never stored on servers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
              <CardContent className="p-5 md:p-7">
                <FormProvider {...formMethods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                      {/* File Upload Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                          Step 1: Upload CV
                        </label>
                        <FileUploader
                          onFileSelect={(selectedFile) => setFile(selectedFile)}
                        />
                      </div>

                      {/* Job Role Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                          Step 2: Target Role
                        </label>
                        <JobRoleSelect
                          value={jobRole}
                          onChange={(value) => setJobRole(value)}
                        />
                      </div>

                      {/* Location Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                          Step 3: Location
                        </label>
                        <LocationSelect
                          value={location}
                          onChange={(value) => setLocation(value)}
                        />
                      </div>

                      {/* Analysis Progress or Submit Button */}
                      {isAnalyzing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
                          <AnalysisProgress
                            steps={steps}
                            currentProgress={progress}
                          />
                        </div>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isAnalyzing || !file || !jobRole || !location}
                          size="lg"
                          className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Start Analysis →
                        </Button>
                      )}
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
