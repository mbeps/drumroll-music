"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Database } from "@/types/types_db";

type SupabaseContextType = {
  supabaseClient: SupabaseClient<Database, "public">;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

interface SupabaseProviderProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      setIsLoading(true);

      try {
        const [
          {
            data: { session },
          },
          {
            data: { user },
          },
        ] = await Promise.all([
          supabaseClient.auth.getSession(),
          supabaseClient.auth.getUser(),
        ]);

        if (!mounted) return;

        setSession(session);
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch Supabase session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      if (!mounted) return;
      syncSession();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const value = useMemo(
    () => ({
      supabaseClient,
      session,
      user,
      isLoading,
    }),
    [supabaseClient, session, user, isLoading]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;

const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error(
      "Supabase hooks can only be used inside a SupabaseProvider component."
    );
  }

  return context;
};

export const useSessionContext = () => useSupabaseContext();

export const useSupabaseClient = () => useSupabaseContext().supabaseClient;

export const useSupabaseUser = () => useSupabaseContext().user;
