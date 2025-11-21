import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ArrowRight,
  Sparkles,
  Globe,
  Shield,
  Activity,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Activity className="h-4 w-4" />
                Powered by Gemini AI
              </div>
              
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-gray-900 dark:text-white">
                Get your resume reviewed by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI recruiters
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Receive a comprehensive analysis of your CV with actionable insights, 
                ATS compatibility checks, and clear recommendations to boost your approval rate.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-14 px-10 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  <Link href="/analyze" className="flex items-center gap-2">
                    Start analyzing
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full h-14 px-10 text-lg border-2 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <Link href="/dashboard">View demo result</Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  ATS-focused analysis
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  No signup required
                </span>
              </div>
            </div>

            {/* Right Column - Preview Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl opacity-50" />
              <div className="relative rounded-[32px] border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 font-semibold">
                    Instant Preview
                  </span>
                  <Badge variant="outline" className="rounded-full border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Score 84%
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Summary</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your profile demonstrates solid mastery in React, scalable 
                    front-end architecture, and REST integrations. Reinforce the 
                    narrative with impact indicators and highlight cloud certifications.
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <PreviewStat title="Technical Fit" value="92%" trend="+8%" />
                  <PreviewStat title="Seniority" value="Mid-level" trend="+" />
                  <PreviewStat title="Soft Skills" value="High" trend="+2" />
                  <PreviewStat title="ATS Score" value="88%" trend="+4%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-24 px-6">
        <div className="container mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="px-4 py-2 text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">
              Advanced Features
            </Badge>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              A complete suite to evolve your resume
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Each analysis generates a modern dashboard focused on employability, 
              storytelling clarity, and optimization for technical recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-white" />}
              color="from-blue-500 to-cyan-400"
              title="Actionable Insights"
              description="Direct, high-impact suggestions for each resume section, focusing on measurable results."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-white" />}
              color="from-purple-500 to-indigo-500"
              title="Market Benchmarking"
              description="Compare your seniority and skillset against international and local job requirements."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              color="from-emerald-500 to-lime-400"
              title="Privacy & Trust"
              description="Local and anonymized processing. Your documents are never stored on our servers."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${color} p-4 shadow-xl`}>
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

function PreviewStat({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 font-semibold">
        {title}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{trend}</span>
      </div>
    </div>
  );
}
