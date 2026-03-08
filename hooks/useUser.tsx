import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import type { UserDetails } from "../types/user-details";
import { mapUserRow } from "@/lib/mappers";
import {
  useSessionContext,
  useSupabaseUser,
} from "@/providers/SupabaseProvider";

/**
 * Shape of the user context exposed by `useUser`.
 */
type UserContextType = {
  /** The current session access token, or null when not authenticated. */
  accessToken: string | null;
  /** The authenticated Supabase auth user, or null when not logged in. */
  user: User | null;
  /** Mapped profile from `public.users`, or null while loading or unauthenticated. */
  userDetails: UserDetails | null;
  /** True while the session or user profile are being fetched. */
  isLoading: boolean;
};

/**
 * React context that provides authentication and profile state across the app.
 * Consume via `useUser` rather than reading this context directly.
 */
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

/**
 * Provides authentication and user profile data to the React tree.
 * Fetches the authenticated user's row from `public.users` on mount
 * and clears state when the session ends.
 *
 * @param children - React children to wrap with the user context.
 * @returns A context provider element wrapping the given children.
 * @author Maruf Bepary
 */
export const MyUserContextProvider = ({ children }: React.PropsWithChildren): React.JSX.Element => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupabaseUser(); // get logged in user (remapped name to avoid conflict)
  const accessToken = session?.access_token ?? null; // get access token
  const [isLoadingData, setIsLoadingData] = useState(false); // loading state for user details
  const isFetchingRef = useRef(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // user details

  useEffect(() => {
    if (!user) {
      if (!isLoadingUser && !isFetchingRef.current) {
        setUserDetails(null);
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
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (isCancelled) {
          return;
        }

        if (error) {
          console.error("Failed to fetch user details:", error);
          return;
        }

        setUserDetails(data ? mapUserRow(data) : null);
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to fetch user details:", error);
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
  }, [user, userDetails, isLoadingUser, supabase]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext value={value}>{children}</UserContext>;
};

/**
 * Returns the current user context including auth state and profile details.
 * Must be called inside a `MyUserContextProvider`; throws otherwise.
 *
 * @returns The current UserContextType with accessToken, user, userDetails, and isLoading.
 * @throws {Error} When called outside of a MyUserContextProvider.
 * @author Maruf Bepary
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // If hook is used outside of the context
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
