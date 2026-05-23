import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { progressionStore } from "@/lib/progression-store";

export interface Milestone {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  phase: string;
  aiSuggested: boolean;
}

export interface PlannerTask {
  id: string;
  task: string;
  timeframe: "week" | "month" | "year";
  dueDate: string;
  done: boolean;
}

const MILESTONES_STORAGE_KEY = "leap.milestones.v1";
const PLANNER_STORAGE_KEY = "leap.planner_tasks.v1";

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "m-1", title: "Complete AI Foundations course", desc: "Gain understanding of neural networks and basic APIs.", done: true, phase: "Phase 1: Exploration", aiSuggested: false },
  { id: "m-2", title: "Attend a developer hackathon", desc: "Collaborate in a team to build a software prototype.", done: true, phase: "Phase 1: Exploration", aiSuggested: false },
  { id: "m-3", title: "Build a frontend application with React", desc: "Demonstrate responsive UI design and state management.", done: false, phase: "Phase 2: Building", aiSuggested: false },
  { id: "m-4", title: "Integrate Mistral AI API into a project", desc: "Implement real AI queries and chat interfaces.", done: false, phase: "Phase 2: Building", aiSuggested: true },
  { id: "m-5", title: "Optimize online professional portfolio", desc: "Publish logged wins and share custom bio link.", done: false, phase: "Phase 3: Launching", aiSuggested: true },
  { id: "m-6", title: "Apply for Summer Software Internships", desc: "Submit resume and portfolio to matched tech companies.", done: false, phase: "Phase 3: Launching", aiSuggested: false },
  { id: "m-7", title: "Attend 3 industry networking events", desc: "Meet peers and professionals; log contacts in Journey Log.", done: false, phase: "Phase 4: Connecting", aiSuggested: false },
  { id: "m-8", title: "Book 5 informational interviews", desc: "Reach out to alumni or speakers for 20-minute career chats.", done: false, phase: "Phase 4: Connecting", aiSuggested: false },
  { id: "m-9", title: "Ship an open-source or research contribution", desc: "One meaningful PR, lab output, or published case study.", done: false, phase: "Phase 5: Mastering", aiSuggested: false },
  { id: "m-10", title: "Earn a role-relevant certification", desc: "Cloud, UX, data, or security cert aligned to your target job.", done: false, phase: "Phase 5: Mastering", aiSuggested: true },
  { id: "m-11", title: "Mentor a junior student or run a workshop", desc: "Teach something you learned — builds leadership signal.", done: false, phase: "Phase 6: Leading", aiSuggested: false },
  { id: "m-12", title: "Negotiate and accept a graduate offer", desc: "Compare offers, confirm start date, and celebrate the leap.", done: false, phase: "Phase 6: Leading", aiSuggested: false },
];

function mergeWithDefaultMilestones(stored: Milestone[]): Milestone[] {
  const byId = new Map(stored.map((m) => [m.id, m]));
  for (const def of DEFAULT_MILESTONES) {
    if (!byId.has(def.id)) byId.set(def.id, def);
  }
  const knownIds = new Set(DEFAULT_MILESTONES.map((d) => d.id));
  const extras = stored.filter((m) => !knownIds.has(m.id));
  return [...DEFAULT_MILESTONES.map((d) => byId.get(d.id)!), ...extras];
}

const DEFAULT_PLANNER: PlannerTask[] = [
  { id: "pt-1", task: "Review React state management hooks", timeframe: "week", dueDate: "In 2 days", done: false },
  { id: "pt-2", task: "Log last workshop experience in Journey Log", timeframe: "week", dueDate: "In 4 days", done: true },
  { id: "pt-3", task: "Message 2 contacts met at UQ Startup Fair", timeframe: "week", dueDate: "This Sunday", done: false },
  { id: "pt-4", task: "Complete the prototype of Pomodoro app", timeframe: "month", dueDate: "June 15", done: false },
  { id: "pt-5", task: "Attend Brisbane AI Builders Meetup", timeframe: "month", dueDate: "June 20", done: false },
  { id: "pt-6", task: "Update LinkedIn headline with target jobs", timeframe: "month", dueDate: "June 25", done: true },
  { id: "pt-7", task: "Land a hybrid/remote Software Engineering Internship", timeframe: "year", dueDate: "Dec 2026", done: false },
  { id: "pt-8", task: "Complete 4 major portfolio projects", timeframe: "year", dueDate: "Nov 2026", done: false },
  { id: "pt-9", task: "Maintain a weekly brand building posting habit", timeframe: "year", dueDate: "Ongoing", done: false },
];

const mapMilestoneFromDb = (row: any): Milestone => ({
  id: row.id,
  title: row.title,
  desc: row.desc_text || "",
  done: row.done,
  phase: row.phase,
  aiSuggested: row.ai_suggested,
});

const mapMilestoneToDb = (m: Partial<Milestone>) => {
  const dbObj: any = {};
  if (m.title !== undefined) dbObj.title = m.title;
  if (m.desc !== undefined) dbObj.desc_text = m.desc;
  if (m.done !== undefined) dbObj.done = m.done;
  if (m.phase !== undefined) dbObj.phase = m.phase;
  if (m.aiSuggested !== undefined) dbObj.ai_suggested = m.aiSuggested;
  return dbObj;
};

const mapPlannerFromDb = (row: any): PlannerTask => ({
  id: row.id,
  task: row.task,
  timeframe: row.timeframe as "week" | "month" | "year",
  dueDate: row.due_date || "",
  done: row.done,
});

const mapPlannerToDb = (pt: Partial<PlannerTask>) => {
  const dbObj: any = {};
  if (pt.task !== undefined) dbObj.task = pt.task;
  if (pt.timeframe !== undefined) dbObj.timeframe = pt.timeframe;
  if (pt.dueDate !== undefined) dbObj.due_date = pt.dueDate;
  if (pt.done !== undefined) dbObj.done = pt.done;
  return dbObj;
};

function loadLocalMilestones(): Milestone[] {
  if (typeof window === "undefined") return DEFAULT_MILESTONES;
  try {
    const raw = localStorage.getItem(MILESTONES_STORAGE_KEY);
    if (!raw) return DEFAULT_MILESTONES;
    const parsed = JSON.parse(raw) as Milestone[];
    return Array.isArray(parsed) && parsed.length
      ? mergeWithDefaultMilestones(parsed)
      : DEFAULT_MILESTONES;
  } catch {
    return DEFAULT_MILESTONES;
  }
}

function saveLocalMilestones(items: Milestone[]) {
  try { localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function loadLocalPlanner(): PlannerTask[] {
  if (typeof window === "undefined") return DEFAULT_PLANNER;
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return DEFAULT_PLANNER;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PLANNER;
  } catch {
    return DEFAULT_PLANNER;
  }
}

function saveLocalPlanner(items: PlannerTask[]) {
  try { localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const milestoneListeners = new Set<() => void>();
const plannerListeners = new Set<() => void>();

let milestoneCache: Milestone[] | null = null;
let plannerCache: PlannerTask[] | null = null;
let currentUser: any = null;

function getMilestones(): Milestone[] {
  if (milestoneCache === null) milestoneCache = loadLocalMilestones();
  return milestoneCache;
}

function getPlanner(): PlannerTask[] {
  if (plannerCache === null) plannerCache = loadLocalPlanner();
  return plannerCache;
}

function setLocalMilestones(items: Milestone[]) {
  milestoneCache = items;
  saveLocalMilestones(items);
  milestoneListeners.forEach((l) => l());
}

function setLocalPlanner(items: PlannerTask[]) {
  plannerCache = items;
  saveLocalPlanner(items);
  plannerListeners.forEach((l) => l());
}

function mergeDoneState<T extends { id: string; done: boolean }>(
  previous: T[],
  incoming: T[],
): T[] {
  const doneById = new Map(previous.map((item) => [item.id, item.done]));
  return incoming.map((item) => ({
    ...item,
    done: doneById.has(item.id) ? doneById.get(item.id)! : item.done,
  }));
}

async function syncMilestonesFromDb() {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .order("created_at", { ascending: true });

  if (!error && data && data.length > 0) {
    const previous = getMilestones();
    const incoming = data.map(mapMilestoneFromDb);
    setLocalMilestones(mergeDoneState(previous, incoming));
  }
}

async function syncPlannerFromDb() {
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (!error && data && data.length > 0) {
    const previous = getPlanner();
    const incoming = data.map(mapPlannerFromDb);
    setLocalPlanner(mergeDoneState(previous, incoming));
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncMilestonesFromDb();
    syncPlannerFromDb();
  } else {
    milestoneCache = null;
    plannerCache = null;
    milestoneListeners.forEach((l) => l());
    plannerListeners.forEach((l) => l());
  }
});

supabase.auth.getSession().then(({ data: { session } }) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncMilestonesFromDb();
    syncPlannerFromDb();
  }
});

export const roadmapStore = {
  // Milestones Methods
  listMilestones: () => getMilestones(),
  setMilestoneDone: async (id: string, done: boolean) => {
    const list = getMilestones();
    const item = list.find((m) => m.id === id);
    if (!item || item.done === done) return;

    const next = list.map((m) => (m.id === id ? { ...m, done } : m));
    setLocalMilestones(next);

    if (currentUser) {
      await supabase.from("milestones").update({ done }).eq("id", id);
    }
  },

  toggleMilestone: async (id: string) => {
    const item = getMilestones().find((m) => m.id === id);
    if (!item) return;
    await roadmapStore.setMilestoneDone(id, !item.done);
  },

  addMilestones: async (newMilestones: Milestone[]) => {
    const list = getMilestones();
    if (currentUser) {
      const rows = newMilestones.map((m) => {
        const row = mapMilestoneToDb(m);
        row.user_id = currentUser.id;
        return row;
      });

      const { data, error } = await supabase
        .from("milestones")
        .insert(rows)
        .select();

      if (!error && data) {
        const added = data.map(mapMilestoneFromDb);
        milestoneCache = [...list.filter((m) => !m.aiSuggested), ...added];
        milestoneListeners.forEach((l) => l());
        return;
      }
    }

    const next = [...list.filter((m) => !m.aiSuggested), ...newMilestones];
    setLocalMilestones(next);
  },

  // Planner Tasks Methods
  listPlannerTasks: () => getPlanner(),
  setPlannerTaskDone: async (id: string, done: boolean) => {
    const list = getPlanner();
    const item = list.find((pt) => pt.id === id);
    if (!item || item.done === done) return;

    const next = list.map((pt) => (pt.id === id ? { ...pt, done } : pt));
    setLocalPlanner(next);

    if (currentUser) {
      await supabase.from("planner_tasks").update({ done }).eq("id", id);
    }
  },

  togglePlannerTask: async (id: string) => {
    const item = getPlanner().find((pt) => pt.id === id);
    if (!item) return;
    await roadmapStore.setPlannerTaskDone(id, !item.done);
  },

  addPlannerTasks: async (newTasks: Omit<PlannerTask, "id" | "done">[]) => {
    const list = getPlanner();
    
    if (currentUser) {
      const rows = newTasks.map((t) => ({
        user_id: currentUser.id,
        task: t.task,
        timeframe: t.timeframe,
        due_date: t.dueDate,
        done: false,
      }));

      const { data, error } = await supabase
        .from("planner_tasks")
        .insert(rows)
        .select();

      if (!error && data) {
        const added = data.map(mapPlannerFromDb);
        plannerCache = [...list, ...added];
        plannerListeners.forEach((l) => l());
      }
      return;
    }

    const tasksToInsert = newTasks.map((t, idx) => ({
      id: `pt-gen-${Date.now()}-${idx}`,
      task: t.task,
      timeframe: t.timeframe,
      dueDate: t.dueDate,
      done: false,
    }));

    const next = [...list, ...tasksToInsert];
    setLocalPlanner(next);
  },
};

export function useMilestones() {
  const [items, setItems] = useState<Milestone[]>(() => getMilestones());
  useEffect(() => {
    const listener = () => setItems([...getMilestones()]);
    milestoneListeners.add(listener);
    return () => { milestoneListeners.delete(listener); };
  }, []);
  return items;
}

export function usePlannerTasks() {
  const [items, setItems] = useState<PlannerTask[]>(() => getPlanner());
  useEffect(() => {
    const listener = () => setItems([...getPlanner()]);
    plannerListeners.add(listener);
    return () => { plannerListeners.delete(listener); };
  }, []);
  return items;
}
