import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DiscoverState {
  itemType: "community" | "chat" | "event";
  itemId: string;
  joined: boolean;
}

const STORAGE_KEY = "leap.discover_states.v1";

// Default joined states
const DEFAULT_JOINED: DiscoverState[] = [
  { itemType: "community", itemId: "c-1", joined: true },
  { itemType: "chat", itemId: "ch-2", joined: true },
];

function loadLocal(): DiscoverState[] {
  if (typeof window === "undefined") return DEFAULT_JOINED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_JOINED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_JOINED;
  } catch {
    return DEFAULT_JOINED;
  }
}

function saveLocal(items: DiscoverState[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const listeners = new Set<() => void>();
let cache: DiscoverState[] | null = null;
let currentUser: any = null;

function getAll(): DiscoverState[] {
  if (cache === null) cache = loadLocal();
  return cache;
}

function setLocal(items: DiscoverState[]) {
  cache = items;
  saveLocal(items);
  listeners.forEach((l) => l());
}

async function syncFromDb() {
  const { data, error } = await supabase
    .from("user_discover_states")
    .select("*");

  if (!error && data) {
    cache = data.map((row: any) => ({
      itemType: row.item_type as "community" | "chat" | "event",
      itemId: row.item_id,
      joined: row.joined,
    }));
    listeners.forEach((l) => l());
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncFromDb();
  } else {
    cache = null;
    listeners.forEach((l) => l());
  }
});

supabase.auth.getSession().then(({ data: { session } }) => {
  currentUser = session?.user || null;
  if (currentUser) {
    syncFromDb();
  }
});

export const discoverStore = {
  list: () => getAll(),
  
  isJoined: (itemType: "community" | "chat" | "event", itemId: string): boolean => {
    const found = getAll().find((s) => s.itemType === itemType && s.itemId === itemId);
    return found ? found.joined : false;
  },

  toggleJoined: async (itemType: "community" | "chat" | "event", itemId: string) => {
    const currentList = getAll();
    const existing = currentList.find((s) => s.itemType === itemType && s.itemId === itemId);
    const nextJoined = existing ? !existing.joined : true;

    if (currentUser) {
      const { error } = await supabase
        .from("user_discover_states")
        .upsert({
          user_id: currentUser.id,
          item_type: itemType,
          item_id: itemId,
          joined: nextJoined,
        }, {
          onConflict: "user_id,item_type,item_id",
        });

      if (!error) {
        if (existing) {
          cache = currentList.map((s) =>
            s.itemType === itemType && s.itemId === itemId ? { ...s, joined: nextJoined } : s
          );
        } else {
          cache = [...currentList, { itemType, itemId, joined: nextJoined }];
        }
        listeners.forEach((l) => l());
      }
      return;
    }

    // Local Storage
    let nextList: DiscoverState[];
    if (existing) {
      nextList = currentList.map((s) =>
        s.itemType === itemType && s.itemId === itemId ? { ...s, joined: nextJoined } : s
      );
    } else {
      nextList = [...currentList, { itemType, itemId, joined: nextJoined }];
    }
    setLocal(nextList);
  },
};

export function useDiscoverStates() {
  const [items, setItems] = useState<DiscoverState[]>(() => getAll());
  useEffect(() => {
    const listener = () => setItems([...getAll()]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  return items;
}
