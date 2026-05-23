import { useMemo } from "react";
import { Sparkles, Star, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/lib/roadmap-store";
import { ROADMAP_PHASE_ORDER } from "@/lib/roadmap-alumni";

const PHASE_META: Record<
  string,
  {
    emoji: string;
    subtitle: string;
    nodeBg: string;
    nodeBorder: string;
    cardBg: string;
    pathColor: string;
  }
> = {
  "Phase 1: Exploration": {
    emoji: "🌱",
    subtitle: "World 1",
    nodeBg: "bg-[#7ee8a8]",
    nodeBorder: "border-[#1a6b3c]",
    cardBg: "bg-[#d4ffe8]",
    pathColor: "#2ec6c9",
  },
  "Phase 2: Building": {
    emoji: "🔨",
    subtitle: "World 2",
    nodeBg: "bg-[#ffd166]",
    nodeBorder: "border-[#b8860b]",
    cardBg: "bg-[#fff3c4]",
    pathColor: "#4a90d9",
  },
  "Phase 3: Launching": {
    emoji: "🚀",
    subtitle: "World 3",
    nodeBg: "bg-[#ffb4a2]",
    nodeBorder: "border-[#c44d3a]",
    cardBg: "bg-[#ffe0d8]",
    pathColor: "#dc6f63",
  },
  "Phase 4: Connecting": {
    emoji: "🤝",
    subtitle: "World 4",
    nodeBg: "bg-[#c4b5fd]",
    nodeBorder: "border-[#5b21b6]",
    cardBg: "bg-[#ede9fe]",
    pathColor: "#7c3aed",
  },
  "Phase 5: Mastering": {
    emoji: "🎯",
    subtitle: "World 5",
    nodeBg: "bg-[#93c5fd]",
    nodeBorder: "border-[#1d4ed8]",
    cardBg: "bg-[#dbeafe]",
    pathColor: "#2563eb",
  },
  "Phase 6: Leading": {
    emoji: "👑",
    subtitle: "World 6",
    nodeBg: "bg-[#fde047]",
    nodeBorder: "border-[#a16207]",
    cardBg: "bg-[#fef9c3]",
    pathColor: "#ca8a04",
  },
};

const DEFAULT_META = {
  emoji: "⭐",
  subtitle: "World",
  nodeBg: "bg-muted",
  nodeBorder: "border-foreground/40",
  cardBg: "bg-surface",
  pathColor: "#888",
};

const CARTOON_SHADOW = "shadow-[4px_4px_0_0_rgba(15,23,42,0.22)]";
const CARTOON_SHADOW_SM = "shadow-[3px_3px_0_0_rgba(15,23,42,0.18)]";

function CartoonCloud({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none text-white/90 dark:text-white/20", className)}
      width="80"
      height="40"
      viewBox="0 0 80 40"
      aria-hidden
    >
      <ellipse cx="24" cy="26" rx="18" ry="12" fill="currentColor" />
      <ellipse cx="42" cy="22" rx="22" ry="14" fill="currentColor" />
      <ellipse cx="58" cy="28" rx="16" ry="11" fill="currentColor" />
    </svg>
  );
}

function CartoonBush({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-5 w-5 rounded-full border-2 border-[#1a6b3c] bg-[#4ade80]"
          style={{ marginTop: i === 1 ? 0 : 4 }}
        />
      ))}
    </div>
  );
}

interface PhaseGroup {
  name: string;
  milestones: Milestone[];
  doneCount: number;
  total: number;
  index: number;
}

interface MilestoneGamePathProps {
  milestones: Milestone[];
  onToggle: (id: string, done?: boolean) => void;
}

export function MilestoneGamePath({ milestones, onToggle }: MilestoneGamePathProps) {
  const phases = useMemo(() => {
    const extraPhases = [...new Set(milestones.map((m) => m.phase))].filter(
      (p) => !ROADMAP_PHASE_ORDER.includes(p as (typeof ROADMAP_PHASE_ORDER)[number]),
    );
    const order = [...ROADMAP_PHASE_ORDER, ...extraPhases];

    return order.map((name, index) => {
      const phaseMilestones = milestones.filter((m) => m.phase === name);
      const doneCount = phaseMilestones.filter((m) => m.done).length;
      return {
        name,
        milestones: phaseMilestones,
        doneCount,
        total: phaseMilestones.length,
        index,
      } satisfies PhaseGroup;
    });
  }, [milestones]);

  const totalDone = milestones.filter((m) => m.done).length;
  const totalCount = milestones.length;
  const overallPercent = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0;
  const activePhaseIndex = phases.findIndex((p) => p.doneCount < p.total);
  const allComplete = activePhaseIndex === -1;

  const pathWidth = 120 + phases.length * 300 + 120;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-4 border-[#1e3a5f]/25",
        "bg-gradient-to-b from-[#b8e4ff] via-[#d4eeff] to-[#8fd694]",
        "dark:from-sky-950 dark:via-background dark:to-green-950",
        CARTOON_SHADOW,
      )}
    >
      {/* Cartoon sky */}
      <CartoonCloud className="absolute left-6 top-5 opacity-95" />
      <CartoonCloud className="absolute right-12 top-8 w-24 opacity-80" />
      <CartoonCloud className="absolute left-1/3 top-3 w-16 opacity-70" />

      {/* Grass strip */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 border-t-4 border-[#1a6b3c]/30 bg-[#5cd66a]"
        aria-hidden
      />
      <CartoonBush className="absolute bottom-2 left-4" />
      <CartoonBush className="absolute bottom-2 right-8" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-7">
        <div>
          <p className="font-display text-xs font-black uppercase tracking-widest text-[#c44d3a] drop-shadow-sm">
            🎮 Quest map
          </p>
          <h3 className="font-display text-xl font-black text-[#1e3a5f] dark:text-foreground md:text-2xl">
            Roll through your career worlds!
          </h3>
        </div>
        <div
          className={cn(
            "rounded-2xl border-4 border-[#1e3a5f]/30 bg-white px-4 py-2 text-center dark:bg-surface",
            CARTOON_SHADOW_SM,
          )}
        >
          <div className="font-display text-2xl font-black text-[#2ec6c9]">{overallPercent}%</div>
          <div className="text-[10px] font-black uppercase text-[#1e3a5f]/70 dark:text-muted-foreground">
            {totalDone}/{totalCount} cleared
          </div>
        </div>
      </div>

      {/* Horizontal scroll path */}
      <div className="relative z-10 mt-4 overflow-x-auto pb-6 scrollbar-thin">
        <div
          className="relative mx-auto flex min-h-[420px] items-center px-6 py-8 md:px-10"
          style={{ minWidth: pathWidth }}
        >
          {/* Wavy cartoon road (horizontal) */}
          <svg
            className="pointer-events-none absolute left-8 right-8 top-1/2 h-24 -translate-y-1/2"
            style={{ width: "calc(100% - 4rem)" }}
            viewBox={`0 0 ${pathWidth} 80`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={`M 0 45 Q ${pathWidth * 0.15} 25, ${pathWidth * 0.3} 45 T ${pathWidth * 0.6} 45 T ${pathWidth * 0.9} 45 L ${pathWidth} 45`}
              fill="none"
              stroke="#b45309"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d={`M 0 45 Q ${pathWidth * 0.15} 25, ${pathWidth * 0.3} 45 T ${pathWidth * 0.6} 45 T ${pathWidth * 0.9} 45 L ${pathWidth} 45`}
              fill="none"
              stroke="#fcd34d"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d={`M 0 45 Q ${pathWidth * 0.15} 25, ${pathWidth * 0.3} 45 T ${pathWidth * 0.6} 45 T ${pathWidth * 0.9} 45 L ${pathWidth} 45`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="10 12"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>

          {/* START */}
          <div className="relative z-10 mr-4 flex shrink-0 flex-col items-center gap-1">
            <div
              className={cn(
                "rounded-2xl border-4 border-[#1e3a5f]/40 bg-[#7ee8a8] px-3 py-2 font-display text-xs font-black uppercase text-[#1e3a5f]",
                CARTOON_SHADOW_SM,
              )}
            >
              Start!
            </div>
            <span className="text-lg" aria-hidden>
              🏁
            </span>
          </div>

          {phases.map((phase) => {
            const meta = PHASE_META[phase.name] ?? DEFAULT_META;
            const isComplete = phase.doneCount === phase.total && phase.total > 0;
            const isActive = phase.index === activePhaseIndex;
            const cardAbove = phase.index % 2 === 0;
            const progressPercent =
              phase.total > 0 ? Math.round((phase.doneCount / phase.total) * 100) : 0;

            return (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: phase.index * 0.1, type: "spring", stiffness: 200, damping: 18 }}
                className="relative z-10 mx-2 flex w-[min(280px,72vw)] shrink-0 flex-col items-center md:w-[300px]"
              >
                {/* Quest card — alternates above / below the road */}
                <div
                  className={cn(
                    "w-full",
                    cardAbove ? "order-1 mb-3" : "order-3 mt-3",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl border-4 p-3.5",
                      meta.cardBg,
                      meta.nodeBorder,
                      CARTOON_SHADOW,
                      cardAbove ? "-rotate-1" : "rotate-1",
                      isActive && "ring-4 ring-[#dc6f63]/40 ring-offset-2",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-[10px] font-black uppercase tracking-wide text-[#1e3a5f]/60">
                          {meta.subtitle}
                        </p>
                        <h4 className="font-display text-base font-black leading-tight text-[#1e3a5f] dark:text-foreground">
                          {phase.name.replace(/^Phase \d+: /, "")}
                        </h4>
                      </div>
                      <span
                        className={cn(
                          "rounded-xl border-2 border-[#1e3a5f]/30 px-2 py-0.5 font-display text-[10px] font-black",
                          isComplete ? "bg-[#7ee8a8]" : "bg-white dark:bg-background",
                        )}
                      >
                        {phase.doneCount}/{phase.total}
                      </span>
                    </div>

                    <div className="mb-2 h-3 overflow-hidden rounded-full border-2 border-[#1e3a5f]/20 bg-white/80">
                      <motion.div
                        className="h-full rounded-full bg-[#dc6f63]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>

                    <ul className="max-h-36 space-y-1.5 overflow-y-auto pr-0.5">
                      {phase.milestones.map((m) => (
                        <li
                          key={m.id}
                          onClick={() => onToggle(m.id)}
                          className={cn(
                            "flex cursor-pointer items-start gap-2 rounded-xl border-2 border-[#1e3a5f]/15 bg-white/90 p-2.5 transition-transform hover:scale-[1.02]",
                            m.done && "opacity-70",
                            CARTOON_SHADOW_SM,
                          )}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={m.done}
                              onCheckedChange={(v) => onToggle(m.id, v === true)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-xs font-black leading-snug text-[#1e3a5f] dark:text-foreground",
                                m.done && "line-through opacity-60",
                              )}
                            >
                              {m.title}
                            </span>
                            <span className="mt-0.5 block text-[10px] font-semibold text-[#1e3a5f]/55 dark:text-muted-foreground">
                              {m.desc}
                            </span>
                          </div>
                          {m.aiSuggested && (
                            <span className="shrink-0 rounded-lg border-2 border-[#c44d3a]/30 bg-[#ffe0d8] px-1 py-0.5 text-[8px] font-black text-[#c44d3a]">
                              <Sparkles className="inline h-2 w-2" /> AI
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Level node on the road */}
                <div className="order-2 flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className={cn(
                      "relative flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 font-display",
                      meta.nodeBg,
                      meta.nodeBorder,
                      CARTOON_SHADOW,
                      isActive && "z-20 scale-110 animate-bounce",
                    )}
                  >
                    <span className="text-3xl leading-none drop-shadow-sm" role="img" aria-hidden>
                      {isComplete ? "⭐" : meta.emoji}
                    </span>
                    <span className="mt-0.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-black text-[#1e3a5f] shadow-sm">
                      Lv {phase.index + 1}
                    </span>
                    {isActive && (
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute -top-7 whitespace-nowrap rounded-full border-2 border-[#c44d3a] bg-[#dc6f63] px-2.5 py-0.5 text-[9px] font-black uppercase text-white"
                        style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
                      >
                        You! →
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}

          {/* FINISH */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 ml-4 flex shrink-0 flex-col items-center gap-2"
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-dashed",
                allComplete
                  ? "border-[#1a6b3c] bg-[#7ee8a8]"
                  : "border-[#1e3a5f]/40 bg-white dark:bg-surface",
                CARTOON_SHADOW,
              )}
            >
              {allComplete ? (
                <Star className="h-8 w-8 fill-[#fcd34d] text-[#b8860b]" />
              ) : (
                <Flag className="h-7 w-7 text-[#1e3a5f]/50" />
              )}
            </div>
            <p className="max-w-[5rem] text-center font-display text-[10px] font-black leading-tight text-[#1e3a5f] dark:text-foreground">
              {allComplete ? "Boss beaten! 🐸" : "Boss level"}
            </p>
          </motion.div>
        </div>
      </div>

      <p className="relative z-10 pb-4 text-center text-[10px] font-bold text-[#1e3a5f]/50 dark:text-muted-foreground">
        ← Scroll the map to explore each world →
      </p>
    </div>
  );
}
