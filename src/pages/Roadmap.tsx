import { ChevronDown, Check, Trophy, Lock, Linkedin, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Jumpy } from "@/components/Jumpy";
import { JumpyNudge } from "@/components/JumpyNudge";
import { mockRoadmap, type RoadmapPhase } from "@/lib/mock-data";
import { useExperiences } from "@/lib/experiences-store";
import { progressionStore, useProgression } from "@/lib/progression-store";
import { cn } from "@/lib/utils";

const Roadmap = () => {
  const experiences = useExperiences();
  const firstUnshared = experiences.find((e) => !Object.values(e.posted).some(Boolean));

  return (
    <div className="container py-8 md:py-10">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roadmap</div>
        <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Your step-by-step plan</h1>
        <p className="text-sm text-muted-foreground">From entrance exams to landing in your new city — and beyond.</p>
      </div>

      <Tabs defaultValue="application" className="w-full">
        <TabsList className="h-auto w-full justify-start gap-1 bg-surface p-1.5 rounded-2xl border-2 border-border flex-wrap">
          <TabsTrigger value="application" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
            Application Journey
          </TabsTrigger>
          <TabsTrigger value="milestones" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
            University Milestones
          </TabsTrigger>
          <TabsTrigger value="brand" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
            Personal Brand Coaching ⭐
          </TabsTrigger>
        </TabsList>

        {/* Application Journey */}
        <TabsContent value="application" className="mt-6">
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <aside className="hidden md:block">
              <div className="sticky top-20 space-y-1 rounded-3xl border-2 border-border bg-surface p-4">
                {mockRoadmap.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 font-display text-xs font-black",
                        p.status === "done" && "border-secondary bg-secondary text-foreground",
                        p.status === "current" && "border-coral bg-coral text-coral-foreground",
                        p.status === "upcoming" && "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {p.status === "done" ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className={cn("text-sm font-bold", p.status === "current" ? "text-foreground" : "text-muted-foreground")}>{p.title}</div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-4">
              {mockRoadmap.map((phase, i) => (
                <PhaseCard key={phase.id} phase={phase} index={i + 1} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* University Milestones */}
        <TabsContent value="milestones" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Orientation Week", emoji: "🎉", status: "upcoming", desc: "Land, settle, meet your cohort" },
              { label: "First Semester", emoji: "📚", status: "locked", desc: "Survive midterms, find your study group" },
              { label: "Internship Search", emoji: "💼", status: "locked", desc: "Apply, interview, land it" },
              { label: "Graduation", emoji: "🎓", status: "locked", desc: "Cap, gown, next chapter" },
            ].map((m) => (
              <div
                key={m.label}
                className={cn(
                  "rounded-3xl border-2 p-5 transition-all",
                  m.status === "upcoming"
                    ? "border-coral bg-surface"
                    : "border-border bg-surface-soft opacity-70",
                )}
              >
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-2 font-display text-base font-extrabold">{m.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                {m.status === "locked" ? (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <Lock className="h-3 w-3" /> Unlocks later
                  </div>
                ) : (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral">
                    <Trophy className="h-3 w-3" /> Up next
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Personal Brand Coaching */}
        <TabsContent value="brand" className="mt-6 space-y-6">
          {firstUnshared && (
            <JumpyNudge
              message={`I noticed you logged "${firstUnshared.title}" but haven't shared it yet. Want me to draft a post? 🚀`}
              ctaLabel="Draft post"
              to={`/journey/${firstUnshared.id}`}
            />
          )}

          {/* Metric cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              icon={<Linkedin className="h-4 w-4" />}
              title="LinkedIn Completeness"
              value="65%"
              progress={65}
              hint="Missing: Recommendations, Featured, Custom URL"
              cta="Fix this now"
            />
            <MetricCard
              icon={<Calendar className="h-4 w-4" />}
              title="Content Consistency"
              value="1 / 4"
              progress={25}
              hint="Posts this month · goal 2-4"
              cta="Plan next post"
              ctaTo="/journey"
            />
            <MetricCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Network Growth"
              value="+12"
              progress={48}
              hint="New connections in April"
              chart
            />
          </div>

          {/* Modules */}
          <div className="grid gap-4 md:grid-cols-2">
            <Module
              title="Module 1 · LinkedIn Foundations"
              items={[
                { id: "m1-0", label: "Professional headshot uploaded", done: true },
                { id: "m1-1", label: "Headline optimized (not just 'Student at X')", done: true },
                { id: "m1-2", label: "About section tells your story", done: false },
                { id: "m1-3", label: "Custom LinkedIn URL set", done: false },
                { id: "m1-4", label: "5+ recommendations received", done: false },
              ]}
            />
            <Module
              title="Module 2 · Content Strategy"
              items={[
                { id: "m2-0", label: "First post published", done: true },
                { id: "m2-1", label: "Consistent posting (2-4x / month)", done: false },
                { id: "m2-2", label: "Engaged with 10+ industry posts", done: false },
                { id: "m2-3", label: "Joined 3+ relevant LinkedIn groups", done: false },
              ]}
            />
            <Module
              title="Module 3 · Thought Leadership"
              items={[
                { id: "m3-0", label: "Shared a unique perspective post", done: false },
                { id: "m3-1", label: "Commented meaningfully on industry trends", done: false },
                { id: "m3-2", label: "Published a LinkedIn article", done: false },
              ]}
            />
            <Module
              title="Module 4 · Portfolio Building"
              items={[
                {
                  id: "m4-0",
                  label: `${experiences.length}+ experiences documented`,
                  done: experiences.length >= 5,
                  readOnly: true,
                },
                { id: "m4-1", label: "Created visual portfolio page", done: false },
                { id: "m4-2", label: "Shared portfolio link in bio", done: false },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PhaseCard = ({ phase, index }: { phase: RoadmapPhase; index: number }) => {
  const { roadmapTaskState } = useProgression();
  const isDone = (taskId: string, fallback: boolean) => roadmapTaskState[taskId] ?? fallback;
  const done = phase.tasks.filter((t) => isDone(t.id, t.done)).length;
  return (
    <Collapsible defaultOpen={phase.status === "current"}>
      <article
        className={cn(
          "rounded-3xl border-2 bg-surface",
          phase.status === "current" ? "border-coral" : "border-border",
        )}
      >
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 p-5 text-left">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg font-black",
                phase.status === "done" && "bg-secondary text-foreground",
                phase.status === "current" && "bg-coral text-coral-foreground",
                phase.status === "upcoming" && "bg-muted text-muted-foreground",
              )}
            >
              {phase.status === "done" ? <Check className="h-5 w-5" /> : index}
            </div>
            <div>
              <div className="font-display text-xl font-extrabold">{phase.title}</div>
              <div className="text-xs text-muted-foreground">{done}/{phase.tasks.length} complete</div>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-3 px-5 pb-5">
            <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
              <Jumpy size="xs" animate="float" />
              <div className="text-sm font-semibold text-foreground">{phase.encouragement}</div>
            </div>
            <ul className="space-y-2">
              {phase.tasks.map((t) => {
                const checked = isDone(t.id, t.done);
                return (
                  <li key={t.id} className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => progressionStore.toggleRoadmapTask(t.id, v === true)}
                      />
                      <span className={cn("text-sm font-semibold", checked && "text-muted-foreground line-through")}>
                        {t.label}
                      </span>
                    </div>
                    {t.due && <span className="text-xs text-muted-foreground">{t.due}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  );
};

const MetricCard = ({
  icon, title, value, progress, hint, cta, ctaTo, chart,
}: {
  icon: React.ReactNode; title: string; value: string; progress: number;
  hint: string; cta?: string; ctaTo?: string; chart?: boolean;
}) => (
  <div className="rounded-3xl border-2 border-border bg-surface p-5">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {icon} {title}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="font-display text-3xl font-black">{value}</span>
    </div>
    {chart ? (
      <div className="mt-3 flex h-10 items-end gap-1">
        {[20, 35, 28, 50, 42, 65, 58, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-secondary/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    ) : (
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-secondary" style={{ width: `${progress}%` }} />
      </div>
    )}
    <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    {cta && (
      ctaTo ? (
        <Link to={ctaTo} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">
          {cta} <ArrowRight className="h-3 w-3" />
        </Link>
      ) : (
        <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">
          {cta} <ArrowRight className="h-3 w-3" />
        </button>
      )
    )}
  </div>
);

const Module = ({
  title,
  items,
}: {
  title: string;
  items: { id: string; label: string; done: boolean; readOnly?: boolean }[];
}) => {
  const { roadmapTaskState } = useProgression();
  const resolved = items.map((item) => ({
    ...item,
    checked: item.readOnly ? item.done : (roadmapTaskState[`brand-${item.id}`] ?? item.done),
  }));
  const doneCount = resolved.filter((i) => i.checked).length;

  return (
    <div className="rounded-3xl border-2 border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-extrabold">{title}</h3>
        <span className="text-xs font-bold text-muted-foreground">
          {doneCount}/{items.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {resolved.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={item.checked}
              disabled={item.readOnly}
              onCheckedChange={(v) =>
                progressionStore.toggleRoadmapTask(`brand-${item.id}`, v === true)
              }
            />
            <span className={cn(item.checked && "text-muted-foreground line-through")}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roadmap;
