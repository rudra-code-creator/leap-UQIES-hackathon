import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Person { name: string; role?: string; linkedin?: string; }
export interface Experience {
  id: string;
  title: string;
  type: "Event" | "Workshop" | "Volunteer" | "Project" | "Internship" | "Competition";
  date: string;
  location?: string;
  photoUrl?: string;
  reflection: string;
  takeaways: string[];
  peopleMet: Person[];
  skills: string[];
  impact?: string;
  posted: { linkedin: boolean; instagram: boolean; tiktok: boolean; twitter: boolean };
}

const STORAGE_KEY = "leap.experiences.v1";

const SEED: Experience[] = [
  {
    id: "ex1",
    title: "UQ Innovation Summit 2026",
    type: "Event",
    date: "Apr 18, 2026",
    location: "Brisbane, AU",
    photoUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70",
    reflection: "First proper startup conference. Felt nervous walking in alone but ended up in three great conversations. Realized I undersell the side project I've been working on.",
    takeaways: [
      "Founders care way more about traction than tech",
      "Cold-emailing speakers actually works",
      "Pitching out loud > rehearsing in my head",
    ],
    peopleMet: [
      { name: "Maya Chen", role: "VC Associate, Blackbird", linkedin: "#" },
      { name: "Rohan Patel", role: "Founder, FleetIQ", linkedin: "#" },
    ],
    skills: ["Networking", "Pitching", "Public Speaking"],
    impact: "Met 8 people, 3 follow-ups booked",
    posted: { linkedin: true, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex2",
    title: "Brisbane Food Bank Volunteer Day",
    type: "Volunteer",
    date: "Apr 6, 2026",
    location: "South Brisbane",
    photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=70",
    reflection: "Spent 4 hours sorting donations with a team of strangers. Left with sore arms and a much clearer view of food insecurity in my own city.",
    takeaways: [
      "Logistics is harder than it looks",
      "Small actions x lots of people = real impact",
    ],
    peopleMet: [{ name: "Sara Lin", role: "Volunteer Coordinator" }],
    skills: ["Teamwork", "Logistics", "Community Impact"],
    impact: "4 hrs · ~200 meals packed",
    posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex3",
    title: "Robotics Workshop — Arduino Basics",
    type: "Workshop",
    date: "Mar 28, 2026",
    location: "UQ Makerspace",
    photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70",
    reflection: "Built my first line-following robot. Frustrating in the middle, super satisfying at the end. Made me rethink whether I want to do pure software or something more physical.",
    takeaways: [
      "Hardware debugging is a different mental model",
      "I learn way faster building than reading",
    ],
    peopleMet: [{ name: "Dr. Wong", role: "Workshop Lead" }],
    skills: ["Arduino", "Soldering", "Debugging"],
    posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex4",
    title: "Hackathon: ClimateHack 2026",
    type: "Competition",
    date: "Mar 15, 2026",
    location: "Online",
    photoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70",
    reflection: "48 hours, 4 teammates I'd never met, one prototype that actually worked. We didn't win but I shipped a working product end-to-end for the first time.",
    takeaways: [
      "Scope down twice as much as you think",
      "Demo > docs in a hackathon setting",
      "Sleep schedule matters more than caffeine",
    ],
    peopleMet: [
      { name: "Liam Park", role: "CS @ ANU" },
      { name: "Ada Williams", role: "Designer @ Canva" },
    ],
    skills: ["React", "Rapid Prototyping", "Team Leadership"],
    impact: "Top 15 of 80 teams",
    posted: { linkedin: true, instagram: true, tiktok: false, twitter: false },
  },
  {
    id: "ex5",
    title: "AWS re:Invent Student Track",
    type: "Event",
    date: "Feb 22, 2026",
    location: "Sydney",
    photoUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70",
    reflection: "Got a student pass through uni. Sessions on serverless were over my head but the hallway track was gold.",
    takeaways: ["Pick 2 sessions max, network the rest of the time"],
    peopleMet: [{ name: "Jade Okafor", role: "Solutions Architect" }],
    skills: ["Cloud Basics", "Networking"],
    posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex6",
    title: "Personal Project: Studyflow",
    type: "Project",
    date: "Feb 1, 2026",
    location: "Self-directed",
    photoUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=70",
    reflection: "Built a Pomodoro app with shared rooms so my friends and I could study 'together' from different cities. 40 weekly users now.",
    takeaways: [
      "Real users find bugs in 5 minutes",
      "Default settings matter more than features",
    ],
    peopleMet: [],
    skills: ["TypeScript", "Realtime", "Product Thinking"],
    impact: "40 weekly active users",
    posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex7",
    title: "International Students Mixer",
    type: "Event",
    date: "Jan 28, 2026",
    location: "UQ Union",
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=70",
    reflection: "Walked in not knowing a soul. Walked out with a study group and a pickup soccer game on Sundays.",
    takeaways: ["Just say hi. That's the whole skill."],
    peopleMet: [
      { name: "Wei Zhang", role: "MSc CS" },
      { name: "Diego Alvarez", role: "BBA" },
    ],
    skills: ["Networking", "Cross-cultural Communication"],
    posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
  },
  {
    id: "ex8",
    title: "Summer Internship — Atlassian",
    type: "Internship",
    date: "Dec 2025 – Feb 2026",
    location: "Sydney (hybrid)",
    photoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70",
    reflection: "10-week summer internship on the Jira Mobile team. Shipped two features behind a flag and presented to ~30 engineers in the final week.",
    takeaways: [
      "Code reviews are where I learned the most",
      "Async writing > meetings",
      "Asking dumb questions early saves days later",
    ],
    peopleMet: [
      { name: "Priya Sharma", role: "Engineering Manager", linkedin: "#" },
      { name: "Jonah Reid", role: "Senior Engineer" },
    ],
    skills: ["React Native", "Code Review", "Tech Communication"],
    impact: "2 features shipped behind feature flags",
    posted: { linkedin: true, instagram: false, tiktok: false, twitter: true },
  },
];

const mapFromDb = (row: any): Experience => ({
  id: row.id,
  title: row.title,
  type: row.type,
  date: row.date,
  location: row.location || undefined,
  photoUrl: row.photo_url || undefined,
  reflection: row.reflection,
  takeaways: row.takeaways || [],
  peopleMet: (row.people_met as Person[]) || [],
  skills: row.skills || [],
  impact: row.impact || undefined,
  posted: (row.posted as Experience["posted"]) || { linkedin: false, instagram: false, tiktok: false, twitter: false },
});

const mapToDb = (exp: Partial<Experience>) => {
  const dbObj: any = {};
  if (exp.title !== undefined) dbObj.title = exp.title;
  if (exp.type !== undefined) dbObj.type = exp.type;
  if (exp.date !== undefined) dbObj.date = exp.date;
  if (exp.location !== undefined) dbObj.location = exp.location;
  if (exp.photoUrl !== undefined) dbObj.photo_url = exp.photoUrl;
  if (exp.reflection !== undefined) dbObj.reflection = exp.reflection;
  if (exp.takeaways !== undefined) dbObj.takeaways = exp.takeaways;
  if (exp.peopleMet !== undefined) dbObj.people_met = exp.peopleMet;
  if (exp.skills !== undefined) dbObj.skills = exp.skills;
  if (exp.impact !== undefined) dbObj.impact = exp.impact;
  if (exp.posted !== undefined) dbObj.posted = exp.posted;
  return dbObj;
};

function loadLocal(): Experience[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Experience[];
    return Array.isArray(parsed) && parsed.length ? parsed : SEED;
  } catch {
    return SEED;
  }
}

function saveLocal(items: Experience[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const listeners = new Set<() => void>();
let cache: Experience[] | null = null;
let currentUser: any = null;

function getAll(): Experience[] {
  if (cache === null) {
    cache = loadLocal();
  }
  return cache;
}

function setAllLocal(next: Experience[]) {
  cache = next;
  saveLocal(next);
  listeners.forEach((l) => l());
}

async function syncFromDb() {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    cache = data.map(mapFromDb);
    listeners.forEach((l) => l());
  }
}

// Watch auth changes
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncFromDb();
  } else {
    cache = null;
    listeners.forEach((l) => l());
  }
});

// Check current session
supabase.auth.getSession().then(({ data: { session } }) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncFromDb();
  }
});

export const experiencesStore = {
  list: () => getAll(),
  get: (id: string) => getAll().find((e) => e.id === id),
  
  add: async (exp: Experience) => {
    if (currentUser) {
      const dbRow = mapToDb(exp);
      dbRow.user_id = currentUser.id;
      
      const { data, error } = await supabase
        .from("experiences")
        .insert(dbRow)
        .select()
        .single();
        
      if (!error && data) {
        const newExp = mapFromDb(data);
        cache = [newExp, ...getAll()];
        listeners.forEach((l) => l());
        return newExp;
      }
    }
    
    const newItems = [exp, ...getAll()];
    setAllLocal(newItems);
    return exp;
  },

  update: async (id: string, patch: Partial<Experience>) => {
    if (currentUser) {
      const dbPatch = mapToDb(patch);
      const { error } = await supabase
        .from("experiences")
        .update(dbPatch)
        .eq("id", id);
      
      if (!error) {
        cache = getAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
        listeners.forEach((l) => l());
      }
      return;
    }

    const next = getAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
    setAllLocal(next);
  },

  markPosted: async (id: string, format: keyof Experience["posted"]) => {
    const item = getAll().find((e) => e.id === id);
    if (!item) return;
    
    const nextPosted = { ...item.posted, [format]: true };
    
    if (currentUser) {
      const { error } = await supabase
        .from("experiences")
        .update({ posted: nextPosted })
        .eq("id", id);
        
      if (!error) {
        cache = getAll().map((e) => (e.id === id ? { ...e, posted: nextPosted } : e));
        listeners.forEach((l) => l());
      }
      return;
    }

    const next = getAll().map((e) => (e.id === id ? { ...e, posted: nextPosted } : e));
    setAllLocal(next);
  },
};

export function useExperiences() {
  const [items, setItems] = useState<Experience[]>(() => getAll());
  useEffect(() => {
    const listener = () => setItems([...getAll()]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  return items;
}
