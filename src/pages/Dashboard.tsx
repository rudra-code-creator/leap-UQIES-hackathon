import { Link } from "react-router-dom";
import { Check, ChevronRight, Newspaper, Flame, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Jumpy } from "@/components/Jumpy";
import { mockChecklist, mockNews, mockPathways, mockUser } from "@/lib/mock-data";
import { progressionStore, useProgression } from "@/lib/progression-store";
import { cn } from "@/lib/utils";

const steps = ["Chose path", "Applied", "Waiting for offer", "Preparing to move"];
const currentStep = 1;

const Dashboard = () => {
  const plan = mockPathways[0];
  const { roadmapTaskState, xp, level, streakDays } = useProgression();
  const checklistDone = mockChecklist.filter((t) => roadmapTaskState[t.id] ?? t.done).length;

  return (
    <div className="container py-8 md:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">
            Welcome back, {mockUser.firstName} 🐸
          </h1>
          <p className="text-sm text-muted-foreground">
            You're in the <span className="font-bold text-foreground">Application</span> phase. Keep hopping!
          </p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            Lvl {level} · {xp.toLocaleString()} XP · {streakDays}-day streak
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Bell className="h-4 w-4" /> 3 updates</Button>
          <Link to="/roadmap"><Button variant="hero" size="sm">View roadmap <ChevronRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Progress */}
        <Card title="Your progress" emoji="🛤️">
          <div className="mt-4 flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-sm font-black",
                    i < currentStep && "border-secondary bg-secondary text-foreground",
                    i === currentStep && "border-coral bg-coral text-coral-foreground animate-pulse",
                    i > currentStep && "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className={cn("mt-2 text-[11px] font-bold leading-tight", i === currentStep ? "text-foreground" : "text-muted-foreground")}>{s}</div>
                {i < steps.length - 1 && (
                  <div className="absolute" />
                )}
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-1.5 rounded-full bg-muted">
            <div className="absolute left-0 top-0 h-full rounded-full bg-secondary" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
          </div>
        </Card>

        {/* Current plan */}
        <Card title="Current plan" emoji={plan.emoji} action={<Link to="/plans" className="text-xs font-bold text-primary">Change →</Link>}>
          <div className="mt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{plan.type}</div>
            <div className="font-display text-xl font-extrabold">{plan.name}</div>
            <div className="text-sm text-muted-foreground">{plan.institution}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Pill>{plan.duration}</Pill>
              <Pill>{plan.cost}</Pill>
              <Pill>{plan.location}</Pill>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary p-3 text-primary-foreground">
              <div>
                <div className="text-[10px] font-bold uppercase opacity-70">Future-proof</div>
                <div className="font-display text-2xl font-black">{plan.futureProof}<span className="text-sm opacity-60">/100</span></div>
              </div>
              <Flame className="h-7 w-7 opacity-80" />
            </div>
          </div>
        </Card>

        {/* Checklist */}
        <Card title="Checklist" emoji="✅" action={<span className="text-xs font-bold text-muted-foreground">{checklistDone}/{mockChecklist.length} done</span>}>
          <ul className="mt-3 space-y-2">
            {mockChecklist.map((t) => {
              const checked = roadmapTaskState[t.id] ?? t.done;
              return (
              <li key={t.id} className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-3 py-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => progressionStore.toggleRoadmapTask(t.id, v === true)}
                  />
                  <span className={cn("text-sm font-semibold", checked && "text-muted-foreground line-through")}>{t.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  {t.urgent && !checked && <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase text-coral">Urgent</span>}
                  <span className="text-xs text-muted-foreground">{t.due}</span>
                </div>
              </li>
            );
            })}
          </ul>
        </Card>

        {/* News */}
        <Card title="Recent news" emoji="📰">
          <ul className="mt-3 space-y-3">
            {mockNews.map((n) => (
              <li key={n.id} className="flex items-start gap-3 rounded-xl border-2 border-border bg-background p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold leading-snug">{n.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{n.source} • {n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Jumpy nudge */}
      <div className="mt-8 flex items-center gap-4 rounded-3xl border-2 border-border bg-surface p-5">
        <Jumpy size="sm" animate="float" />
        <div className="flex-1">
          <div className="font-display text-lg font-extrabold">Need a hand with anything?</div>
          <div className="text-sm text-muted-foreground">I can draft your personal statement or compare scholarships in seconds.</div>
        </div>
        <Link to="/chat"><Button variant="hero" size="sm">Chat now</Button></Link>
      </div>
    </div>
  );
};

const Card = ({ title, emoji, action, children }: { title: string; emoji: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section className="rounded-3xl border-2 border-border bg-surface p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h2 className="font-display text-lg font-extrabold">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">{children}</span>
);

export default Dashboard;
