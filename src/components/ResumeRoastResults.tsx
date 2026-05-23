import { FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ResumeRoastAnalysis } from "@/lib/resume-roast";
import { cn } from "@/lib/utils";

const criteriaChartConfig = {
  score: { label: "Score", color: "hsl(var(--coral))" },
};

const skillsChartConfig = {
  level: { label: "Proficiency", color: "hsl(var(--secondary))" },
};

interface ResumeRoastResultsProps {
  analysis: ResumeRoastAnalysis;
  resumeFile: File;
  previewUrl: string | null;
  textPreview: string | null;
}

export function ResumeRoastResults({
  analysis,
  resumeFile,
  previewUrl,
  textPreview,
}: ResumeRoastResultsProps) {
  const isPdf = resumeFile.type === "application/pdf" || resumeFile.name.toLowerCase().endsWith(".pdf");
  const isTxt = resumeFile.type === "text/plain" || resumeFile.name.toLowerCase().endsWith(".txt");
  const isDoc =
    resumeFile.name.toLowerCase().endsWith(".doc") || resumeFile.name.toLowerCase().endsWith(".docx");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-border bg-background overflow-hidden flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-surface">
            <h3 className="font-display text-sm font-black text-foreground uppercase tracking-wide">
              Your Resume
            </h3>
            <span className="text-xs font-bold text-muted-foreground truncate max-w-[50%]">
              {resumeFile.name}
            </span>
          </div>
          <div className="flex-1 min-h-[280px] bg-muted/30">
            {isPdf && previewUrl ? (
              <iframe
                title="Resume preview"
                src={previewUrl}
                className="h-full min-h-[280px] w-full border-0"
              />
            ) : isTxt && textPreview ? (
              <pre className="h-full min-h-[280px] overflow-auto p-4 text-xs leading-relaxed text-foreground font-mono whitespace-pre-wrap">
                {textPreview}
              </pre>
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm font-bold text-foreground">
                  {isDoc ? "Word document uploaded" : "Preview unavailable"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  {isDoc
                    ? "DOCX files can't be embedded in the browser. Your roast and skill scores are still based on the file you uploaded."
                    : "Upload a PDF or TXT file to see an inline preview here."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-coral/30 bg-coral/5 p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-coral/20">
            <h3 className="font-display text-sm font-black text-coral uppercase tracking-wide">
              Roast Results
            </h3>
            <span className="rounded-full bg-coral/15 border border-coral/25 px-2.5 py-0.5 text-xs font-black text-coral">
              {analysis.overallScore}/100
            </span>
          </div>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium overflow-y-auto max-h-[400px] pr-1 flex-1">
            {analysis.roast}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-border bg-background p-4 space-y-3">
          <div>
            <h3 className="font-display text-sm font-black text-foreground">Resume Criteria</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              How your resume scores across key hiring dimensions
            </p>
          </div>
          <ChartContainer config={criteriaChartConfig} className="mx-auto h-[280px] w-full">
            <RadarChart data={analysis.criteria} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-score)"
                fill="var(--color-score)"
                fillOpacity={0.35}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
          <ul className="grid grid-cols-2 gap-2">
            {analysis.criteria.map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-xs"
              >
                <span className="font-semibold text-foreground truncate pr-2">{c.name}</span>
                <span
                  className={cn(
                    "font-black shrink-0",
                    c.score >= 70 ? "text-secondary" : c.score >= 50 ? "text-foreground" : "text-coral",
                  )}
                >
                  {c.score}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-border bg-background p-4 space-y-3">
          <div>
            <h3 className="font-display text-base font-black text-foreground">Skill Proficiency</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Inferred skill levels from your resume content
            </p>
          </div>
          <ChartContainer config={skillsChartConfig} className="mx-auto h-[280px] w-full">
            <BarChart data={analysis.skills} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={112}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Bar dataKey="level" fill="var(--color-level)" radius={[0, 4, 4, 0]} maxBarSize={18} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
