"use client";

/**
 * @fileoverview User profile and session context provider.
 * Manages user details, profile data, and session state from Supabase.
 * Must wrap application tree after SupabaseProvider.
 *
 * @author Maruf Bepary
 */

import type { User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { isAdmin as checkIsAdmin } from "@/lib/auth/permissions";
import { getLogger } from "@/lib/logger";
import { mapUserRow } from "@/lib/mappers/user";
import { useSessionContext, useSupabaseUser } from "@/providers/supabase-provider";
import type { UserDetails } from "@/types/user/user-details";

/**
 * Shape of the user context exposed by UserContext.
 */
export type UserContextType = {
  /** The current session access token, or null when not authenticated. */
  accessToken: string | null;
  /** The authenticated Supabase auth user (augmented with isAdmin), or null when not logged in. */
  user: (User & { isAdmin?: boolean }) | null;
  /** Mapped profile from `public.users`, or null while loading or unauthenticated. */
  userDetails: UserDetails | null;
  /** Whether the authenticated user has global administrative access. */
  isAdmin: boolean;
  /** True while the session or user profile are being fetched. */
  isLoading: boolean;
};

/**
 * React context that provides authentication and profile state across the app.
 */
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Provides authentication and user profile context to the React tree.
 * Wraps the app and makes user session, auth user, and profile data available via `useUser()` hook.
 * Fetches the authenticated user's profile from `public.users` on mount and clears state when logged out.
 *
 * @param props - Component props containing children to wrap.
 * @returns A context provider element wrapping the given children.
 * @author Maruf Bepary
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
  const rawUser = useSupabaseUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const isFetchingRef = useRef(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isDbAdmin, setIsDbAdmin] = useState<boolean | null>(null);

  const isConfigAdmin = rawUser ? checkIsAdmin(rawUser) : false;
  const isAdmin = isConfigAdmin || isDbAdmin === true;

  const user = useMemo(() => {
    if (!rawUser) return null;
    return Object.assign(rawUser, { isAdmin });
  }, [rawUser, isAdmin]);

  useEffect(() => {
    if (!rawUser) {
      if (!isLoadingUser && !isFetchingRef.current) {
        setUserDetails(null);
        setIsDbAdmin(null);
      }
      return;
    }

    if (isLoadingUser || userDetails !== null) {
      return;
    }

    let isCancelled = false;

    const fetchUserDetails = async () => {
      setIsLoadingData(true);
      isFetchingRef.current = true;
      try {
        const [userResult, adminResult] = await Promise.allSettled([
          supabase.from("users").select("*").eq("id", rawUser.id).maybeSingle(),
          supabase.rpc("is_admin"),
        ]);

        if (isCancelled) {
          return;
        }

        if (userResult.status === "fulfilled") {
          const { data, error } = userResult.value;
          if (error) {
            const logger = getLogger(["app", "providers", "user"]);
            logger.error("Failed to fetch user details for {userId}: {error}", {
              userId: rawUser.id,
              error,
            });
          } else {
            setUserDetails(data ? mapUserRow(data) : null);
          }
        }

        if (adminResult.status === "fulfilled") {
          const { data, error } = adminResult.value;
          if (!error && typeof data === "boolean") {
            setIsDbAdmin(data);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          const logger = getLogger(["app", "providers", "user"]);
          logger.error("Unexpected error fetching user details: {error}", {
            error,
          });
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingData(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchUserDetails();

    return () => {
      isCancelled = true;
      isFetchingRef.current = false;
    };
  }, [rawUser, userDetails, isLoadingUser, supabase]);

  const value = {
    accessToken,
    user,
    userDetails,
    isAdmin,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext value={value}>{children}</UserContext>;
};

export default UserProvider;
