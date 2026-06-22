"use client";

/**
 * @fileoverview Root-level Supabase authentication orchestrator.
 * Manages client instance, session state, user data, and loading state across the application.
 * Wraps the entire component tree and must be placed before UserProvider and ModalProvider.
 *
 * @author Maruf Bepary
 * @see UserProvider
 * @see createBrowserSupabaseClient
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Database } from "@/types/database/types_db";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "providers", "supabase"]);

/**
 * Shape of the Supabase context.
 * Provides access to the Supabase client, current session, authenticated user, and auth state.
 *
 * @typedef {Object} SupabaseContextType
 */
type SupabaseContextType = {
  supabaseClient: SupabaseClient<Database, "public">;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

/**
 * Props for the SupabaseProvider component.
 */
interface SupabaseProviderProps {
  children: React.ReactNode;
}

/**
 * Initializes Supabase authentication and syncs session state.
 * Must be the root-most provider, wrapping both UserProvider and ModalProvider.
 * Fetches initial session on mount and syncs state on auth changes.
 *
 * @param props Component props with children to wrap.
 * @returns Provider component managing Supabase context.
 * @throws Error if Supabase environment variables are not configured.
 */
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
        logger.error("Failed to fetch Supabase session: {error}", { error });
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
    <SupabaseContext value={value}>
      {children}
    </SupabaseContext>
  );
};

export default SupabaseProvider;

/**
 * Accesses the Supabase context.
 * Throws an error if used outside SupabaseProvider.
 *
 * @returns Supabase context containing client, session, user, and loading state.
 * @throws Error if called outside SupabaseProvider.
 */
const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error(
      "Supabase hooks can only be used inside a SupabaseProvider component."
    );
  }

  return context;
};

/**
 * Retrieves the current Supabase session and user.
 * Throws an error if used outside SupabaseProvider.
 *
 * @returns Supabase context with full session and user data.
 * @throws Error if called outside SupabaseProvider.
 */
export const useSessionContext = () => useSupabaseContext();

/**
 * Retrieves the initialized Supabase client for browser-side queries and mutations.
 * Throws an error if used outside SupabaseProvider.
 *
 * @returns Supabase client instance typed to the application database.
 * @throws Error if called outside SupabaseProvider.
 */
export const useSupabaseClient = () => useSupabaseContext().supabaseClient;

/**
 * Retrieves the currently authenticated user, or null if not signed in.
 * Throws an error if used outside SupabaseProvider.
 *
 * @returns Current Supabase user object or null.
 * @throws Error if called outside SupabaseProvider.
 */
export const useSupabaseUser = () => useSupabaseContext().user;
