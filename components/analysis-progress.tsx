"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed";
}

interface AnalysisProgressProps {
  steps: AnalysisStep[];
  currentProgress: number;
}

export function AnalysisProgress({
  steps,
  currentProgress,
}: AnalysisProgressProps) {
  return (
    <div className="space-y-6">
      <Progress value={currentProgress} className="h-2 transition-all" />
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center space-x-3 transition-opacity",
              step.status === "pending" ? "opacity-50" : "opacity-100"
            )}
          >
            {step.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-primary animate-check" />
            ) : step.status === "processing" ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
