import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mockRoadmap } from "@/lib/mock-data";

export const XP_RULES = {
  quizComplete: 100,
  roadmapTask: 25,
  journeyLog: 50,
  contentPosted: 30,
  contentGenerated: 20,
  brandModuleItem: 40,
} as const;

const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export interface ProgressionState {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  achievementsUnlocked: string[];
  roadmapTaskState: Record<string, boolean>;
  xpGrants: Record<string, boolean>;
}

const STORAGE_KEY = "leap.progression.v1";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

export function xpProgressInLevel(xp: number): { current: number; needed: number; percent: number } {
  const level = levelFromXp(xp);
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const ceiling = LEVEL_THRESHOLDS[level] ?? floor + 500;
  const current = xp - floor;
  const needed = ceiling - floor;
  return {
    current,
    needed,
    percent: needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100,
  };
}

function seedRoadmapTaskState(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const phase of mockRoadmap) {
    for (const task of phase.tasks) {
      state[task.id] = task.done;
    }
  }
  return state;
}

const DEFAULT: ProgressionState = {
  xp: 1240,
  streakDays: 3,
  lastActiveDate: todayIso(),
  achievementsUnlocked: [],
  roadmapTaskState: seedRoadmapTaskState(),
  xpGrants: { quiz_complete: true },
};

function load(): ProgressionState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT, roadmapTaskState: seedRoadmapTaskState() };
    const parsed = JSON.parse(raw) as ProgressionState;
    return {
      ...DEFAULT,
      ...parsed,
      roadmapTaskState: { ...seedRoadmapTaskState(), ...parsed.roadmapTaskState },
      achievementsUnlocked: parsed.achievementsUnlocked ?? [],
      xpGrants: parsed.xpGrants ?? {},
    };
  } catch {
    return { ...DEFAULT, roadmapTaskState: seedRoadmapTaskState() };
  }
}

function save(state: ProgressionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

function bumpStreak(state: ProgressionState): ProgressionState {
  const today = todayIso();
  if (state.lastActiveDate === today) return state;

  let streakDays = 1;
  if (state.lastActiveDate === yesterdayIso()) {
    streakDays = state.streakDays + 1;
  }

  return { ...state, streakDays, lastActiveDate: today };
}

const listeners = new Set<() => void>();
let cache: ProgressionState | null = null;

function getState(): ProgressionState {
  if (cache === null) cache = load();
  return cache;
}

function setState(next: ProgressionState) {
  cache = next;
  save(next);
  listeners.forEach((l) => l());
}

export interface GrantXpOptions {
  /** One-time grant id; skips if already granted */
  grantKey?: string;
  /** Shown in toast, e.g. "Win logged" */
  label?: string;
  showToast?: boolean;
}

function grantXp(amount: number, options: GrantXpOptions = {}): boolean {
  if (amount <= 0) return false;

  const { grantKey, label, showToast = true } = options;
  let state = getState();

  if (grantKey && state.xpGrants[grantKey]) return false;

  const prevLevel = levelFromXp(state.xp);
  state = bumpStreak(state);
  state = {
    ...state,
    xp: state.xp + amount,
    xpGrants: grantKey ? { ...state.xpGrants, [grantKey]: true } : state.xpGrants,
  };
  setState(state);

  const newLevel = levelFromXp(state.xp);

  if (showToast) {
    const msg = label ? `+${amount} XP — ${label}` : `+${amount} XP`;
    toast.success(msg);
    if (newLevel > prevLevel) {
      toast.success(`Level up! You're now Lvl ${newLevel} 🐸`, { duration: 4000 });
    }
  }

  return true;
}

export const progressionStore = {
  get: () => getState(),
  getLevel: () => levelFromXp(getState().xp),
  getXp: () => getState().xp,
  getStreak: () => getState().streakDays,
  isRoadmapTaskDone: (taskId: string, fallback = false) =>
    getState().roadmapTaskState[taskId] ?? fallback,
  grantQuizComplete: () =>
    grantXp(XP_RULES.quizComplete, { grantKey: "quiz_complete", label: "Quiz complete" }),
  grantJourneyLog: (experienceId: string) =>
    grantXp(XP_RULES.journeyLog, { grantKey: `journey:${experienceId}`, label: "Win logged" }),
  grantContentPosted: (experienceId: string, format: string) =>
    grantXp(XP_RULES.contentPosted, {
      grantKey: `posted:${experienceId}:${format}`,
      label: "Content shared",
    }),
  grantContentGenerated: (experienceId: string, format: string) =>
    grantXp(XP_RULES.contentGenerated, {
      grantKey: `generate:${experienceId}:${format}`,
      label: "Draft created",
    }),
  toggleRoadmapTask: (taskId: string, done: boolean) => {
    const state = getState();
    const wasDone = state.roadmapTaskState[taskId] ?? false;
    const next = { ...state, roadmapTaskState: { ...state.roadmapTaskState, [taskId]: done } };
    setState(bumpStreak(next));
    if (done && !wasDone) {
      const isBrand = taskId.startsWith("brand-");
      grantXp(isBrand ? XP_RULES.brandModuleItem : XP_RULES.roadmapTask, {
        grantKey: isBrand ? taskId.replace("brand-", "brand:") : `task:${taskId}`,
        label: isBrand ? "Brand milestone" : "Task complete",
      });
    }
  },
  unlockAchievement: (id: string) => {
    const state = getState();
    if (state.achievementsUnlocked.includes(id)) return;
    setState({
      ...state,
      achievementsUnlocked: [...state.achievementsUnlocked, id],
    });
    toast.success(`Achievement unlocked: ${id} 🏆`);
  },
};

export function useProgression() {
  const [state, setLocal] = useState<ProgressionState>(() => getState());
  useEffect(() => {
    const listener = () => setLocal({ ...getState() });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return {
    ...state,
    level: levelFromXp(state.xp),
    levelProgress: xpProgressInLevel(state.xp),
  };
}
