import { ArrowRight, GripVertical, Heart, MapPin, Clock, DollarSign, TrendingUp, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPathways, type Pathway } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const Plans = () => {
  const [main, ...backups] = mockPathways;

  return (
    <div className="container py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plans</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Your top 3 pathways</h1>
          <p className="text-sm text-muted-foreground">Drag to reorder. Pick a main plan, keep the rest as backups.</p>
        </div>
        <Button variant="outline" size="sm"><GitCompare className="h-4 w-4" /> Compare plans</Button>
      </div>

      {/* Main plan */}
      <PlanCard pathway={main} variant="main" rank={1} />

      {/* Backups */}
      <div className="mt-6">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Backups</div>
        <div className="grid gap-4 md:grid-cols-2">
          {backups.map((p, i) => (
            <PlanCard key={p.id} pathway={p} variant="backup" rank={i + 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ pathway: p, variant, rank }: { pathway: Pathway; variant: "main" | "backup"; rank: number }) => {
  const isMain = variant === "main";
  return (
    <article
      className={cn(
        "relative rounded-3xl border-2 bg-surface transition-transform hover:-translate-y-0.5",
        isMain ? "border-secondary p-6 shadow-[0_4px_0_0_hsl(var(--primary))] md:p-8" : "border-border p-5",
      )}
    >
      <button aria-label="Drag to reorder" className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-muted-foreground/60 hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </button>

      <div className={cn("grid gap-6", isMain && "md:grid-cols-[1fr_280px]")}>
        <div className="pl-6">
          <div className="mb-3 flex items-center gap-2">
            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", isMain ? "bg-coral text-coral-foreground" : "bg-secondary text-foreground")}>
              {isMain ? "★ Main plan" : `Backup #${rank - 1}`}
            </span>
            <span className="rounded-full border-2 border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground">{p.type}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl", isMain ? "h-16 w-16" : "h-12 w-12 text-2xl")}>
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={cn("font-display font-black leading-tight", isMain ? "text-2xl md:text-3xl" : "text-lg")}>{p.name}</h2>
              <div className="text-sm text-muted-foreground">{p.institution}</div>
            </div>
            <button aria-label="Favorite" className="text-muted-foreground hover:text-coral"><Heart className="h-5 w-5" /></button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            <Meta icon={Clock} text={p.duration} />
            <Meta icon={DollarSign} text={p.cost} />
            <Meta icon={MapPin} text={p.location} />
          </div>

          {isMain && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Why this fits: </span>{p.why}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button variant="hero" size="sm">View full roadmap <ArrowRight className="h-4 w-4" /></Button>
            {isMain && <Button variant="outline" size="sm">Make backup</Button>}
            {!isMain && <Button variant="outline" size="sm">Set as main</Button>}
          </div>
        </div>

        {isMain && (
          <div className="space-y-3 rounded-2xl bg-background p-4">
            <div className="flex items-center justify-between rounded-xl bg-primary p-3 text-primary-foreground">
              <div>
                <div className="text-[10px] font-bold uppercase opacity-70">Future-proof</div>
                <div className="font-display text-2xl font-black">{p.futureProof}<span className="text-sm opacity-60">/100</span></div>
              </div>
              <TrendingUp className="h-7 w-7 opacity-80" />
            </div>
            <MatchBar label="Budget fit" value={p.match.budget} />
            <MatchBar label="Career & interests" value={p.match.career} />
            <MatchBar label="Location fit" value={p.match.location} />
            <MatchBar label="Lifestyle fit" value={p.match.lifestyle} />
          </div>
        )}
      </div>
    </article>
  );
};

const Meta = ({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) => (
  <div className="flex items-center gap-1.5 text-muted-foreground">
    <Icon className="h-3.5 w-3.5" />
    <span>{text}</span>
  </div>
);

const MatchBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs font-semibold">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-secondary" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default Plans;
