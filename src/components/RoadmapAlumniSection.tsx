import { ExternalLink, Linkedin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ROADMAP_ALUMNI_BY_PHASE,
  ROADMAP_PHASE_ORDER,
  phaseShortLabel,
  type RoadmapPhaseName,
} from "@/lib/roadmap-alumni";
import { cn } from "@/lib/utils";

const PHASE_ACCENT: Record<RoadmapPhaseName, string> = {
  "Phase 1: Exploration": "border-[#1a6b3c]/30 bg-[#d4ffe8]",
  "Phase 2: Building": "border-[#b8860b]/30 bg-[#fff3c4]",
  "Phase 3: Launching": "border-[#c44d3a]/30 bg-[#ffe0d8]",
  "Phase 4: Connecting": "border-[#5b21b6]/30 bg-[#ede9fe]",
  "Phase 5: Mastering": "border-[#1d4ed8]/30 bg-[#dbeafe]",
  "Phase 6: Leading": "border-[#a16207]/30 bg-[#fef9c3]",
};

export function RoadmapAlumniSection() {
  return (
    <section className="rounded-3xl border-2 border-border bg-surface p-5 md:p-6 space-y-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Users className="h-4 w-4 text-secondary" />
            Alumni mentors
          </div>
          <h3 className="mt-1 font-display text-lg font-black text-foreground md:text-xl">
            Reach out by stage
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Useful UQ and Brisbane alumni matched to each world on your map — message them on LinkedIn for advice at that step.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ROADMAP_PHASE_ORDER.map((phase, index) => {
          const alumni = ROADMAP_ALUMNI_BY_PHASE[phase];
          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: "spring", stiffness: 120, damping: 16 }}
              className={cn(
                "rounded-2xl border-2 p-4 space-y-3",
                PHASE_ACCENT[phase],
              )}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                  World {index + 1}
                </p>
                <h4 className="font-display text-base font-extrabold text-foreground">
                  {phaseShortLabel(phase)}
                </h4>
              </div>

              <ul className="space-y-2.5">
                {alumni.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-xl border-2 border-border/60 bg-background/90 p-3 space-y-2"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground leading-snug">{person.name}</p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {person.role} · {person.company}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{person.tip}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full text-xs font-bold gap-1.5"
                      asChild
                    >
                      <a
                        href={person.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        Message on LinkedIn
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
