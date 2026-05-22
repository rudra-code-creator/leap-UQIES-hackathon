import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Mic } from "lucide-react";
import { useExperiences, type Experience } from "@/lib/experiences-store";
import { ExperienceCard } from "@/components/ExperienceCard";
import { JumpyNudge } from "@/components/JumpyNudge";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ label: string; value: "All" | Experience["type"] | "People" }> = [
  { label: "All", value: "All" },
  { label: "Events", value: "Event" },
  { label: "Workshops", value: "Workshop" },
  { label: "Volunteering", value: "Volunteer" },
  { label: "Projects", value: "Project" },
  { label: "Internships", value: "Internship" },
  { label: "Competitions", value: "Competition" },
];

const JourneyLog = () => {
  const experiences = useExperiences();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? experiences : experiences.filter((e) => e.type === filter)),
    [experiences, filter],
  );

  const unsharedCount = experiences.filter(
    (e) => !Object.values(e.posted).some(Boolean),
  ).length;
  const thisMonth = experiences.filter((e) => e.date.includes("2026")).length;
  const firstUnshared = experiences.find((e) => !Object.values(e.posted).some(Boolean));

  return (
    <div className="container py-8 md:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Journey Log</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Document your wins. Build your brand.</h1>
          <p className="text-sm text-muted-foreground">
            Every workshop, event, project — turned into share-ready content with a tap.
          </p>
        </div>
        <Link
          to="/journey/new"
          className="inline-flex items-center gap-2 self-start rounded-full bg-foreground px-5 py-3 font-display text-sm font-extrabold text-background transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" /> Log experience
        </Link>
      </div>

      {/* Nudge */}
      {firstUnshared && (
        <div className="mb-6">
          <JumpyNudge
            message={`You logged "${firstUnshared.title}" but haven't shared it yet. Want me to draft a post?`}
            ctaLabel="Draft it"
            to={`/journey/${firstUnshared.id}`}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main column */}
        <div>
          {/* Filter chips */}
          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all",
                  filter === f.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:border-foreground/40",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center">
              <div className="text-4xl">📝</div>
              <p className="mt-3 font-display text-lg font-bold">Nothing logged here yet</p>
              <p className="text-sm text-muted-foreground">Try a different filter or add your first experience.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="hidden space-y-4 lg:block">
          <button className="group flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-surface p-4 text-left transition-colors hover:border-coral">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral text-coral-foreground">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-sm font-extrabold">Quick voice log</div>
              <div className="text-xs text-muted-foreground">Tap to record (coming soon)</div>
            </div>
          </button>

          <div className="rounded-3xl border-2 border-border bg-surface p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand streak</div>
            <div className="mt-2 font-display text-3xl font-black">{thisMonth}</div>
            <div className="text-xs text-muted-foreground">experiences logged in 2026</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${Math.min(100, thisMonth * 12)}%` }}
              />
            </div>
            {unsharedCount > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-bold text-coral">{unsharedCount} unshared</span> · turn them into content
              </p>
            )}
          </div>

          <div className="rounded-3xl border-2 border-border bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" /> Upcoming
            </div>
            <ul className="space-y-2 text-sm">
              <li className="rounded-xl bg-background px-3 py-2">
                <div className="font-bold">UQ Career Fair</div>
                <div className="text-xs text-muted-foreground">May 9 · UQ Union</div>
              </li>
              <li className="rounded-xl bg-background px-3 py-2">
                <div className="font-bold">Women in Tech Mixer</div>
                <div className="text-xs text-muted-foreground">May 14 · Online</div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JourneyLog;
