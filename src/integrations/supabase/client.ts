// This file is modified to use a local-storage based mock client.
// All Supabase database calls run in offline-mode.
import type { Database } from './types';

const SESSION_KEY = "leap.mock.session";
const PROFILE_KEY = "leap.mock.profile";

type SubscriptionCallback = (event: string, session: any) => void;
const authCallbacks = new Set<SubscriptionCallback>();

function notifyAuthChange(event: string, session: any) {
  authCallbacks.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Auth callback error:", e);
    }
  });
}

function getLocalSession() {
  try {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    return sessionRaw ? JSON.parse(sessionRaw) : null;
  } catch {
    return null;
  }
}

function getLocalProfile() {
  try {
    const profileRaw = localStorage.getItem(PROFILE_KEY);
    return profileRaw ? JSON.parse(profileRaw) : null;
  } catch {
    return null;
  }
}

export const supabase = {
  auth: {
    getSession: async () => {
      const session = getLocalSession();
      return { data: { session }, error: null };
    },

    onAuthStateChange: (callback: SubscriptionCallback) => {
      authCallbacks.add(callback);
      const session = getLocalSession();
      // Invoke callback asynchronously to match real Supabase timing
      setTimeout(() => callback("INITIAL_SESSION", session), 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authCallbacks.delete(callback);
            }
          }
        }
      };
    },

    signUp: async ({ email, password, options }: any) => {
      const metadata = options?.data || {};
      const mockUser = {
        id: "mock-user-" + Math.random().toString(36).substring(2, 11),
        email,
        user_metadata: metadata,
      };
      const mockSession = { user: mockUser };

      localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        id: mockUser.id,
        name: metadata.name || "Explorer",
        age: metadata.age || 22,
        location: metadata.location || "Sydney, Australia",
        current_education: metadata.current_education || "none",
        desired_field: metadata.desired_field || "",
        interests: metadata.interests || [],
      }));

      notifyAuthChange("SIGNED_IN", mockSession);
      return { data: { user: mockUser, session: mockSession }, error: null };
    },

    signInWithPassword: async ({ email }: any) => {
      const existingProfile = getLocalProfile();
      const mockUser = {
        id: existingProfile?.id || "mock-user-id",
        email,
        user_metadata: {
          name: existingProfile?.name || "Explorer",
        }
      };
      const mockSession = { user: mockUser };

      localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));
      if (!existingProfile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({
          id: mockUser.id,
          name: "Explorer",
          age: 22,
          location: "Sydney, Australia",
          current_education: "none",
          desired_field: "",
          interests: [],
        }));
      }

      notifyAuthChange("SIGNED_IN", mockSession);
      return { data: { user: mockUser, session: mockSession }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(SESSION_KEY);
      notifyAuthChange("SIGNED_OUT", null);
      return { error: null };
    }
  },

  from: (table: string) => {
    const builder: any = {
      select: (columns?: string) => builder,
      insert: (rows: any) => builder,
      update: (patch: any) => {
        if (table === "profiles") {
          const currentProfile = getLocalProfile() || {};
          const newProfile = { ...currentProfile, ...patch };
          localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        }
        return builder;
      },
      delete: () => builder,
      eq: (column: string, value: any) => builder,
      order: (column: string, options?: any) => builder,
      single: () => builder,

      // Thenable implementation to support async/await builder queries
      then: (resolve: any, reject: any) => {
        if (table === "profiles") {
          resolve({ data: getLocalProfile(), error: null });
        } else {
          // Trigger fallback to localStorage for all other tables
          resolve({ data: null, error: { message: "Mock local client fallback" } });
        }
      }
    };

    return builder;
  }
};