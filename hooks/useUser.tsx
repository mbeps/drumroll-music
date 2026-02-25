import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { UserDetails } from "@/types/types";
import { Database } from "@/types/types_db";
import {
  useSessionContext,
  useSupabaseUser,
} from "@/providers/SupabaseProvider";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

/** Maps a raw Supabase users row to the domain UserDetails type. */
const mapUserRow = (row: UserRow): UserDetails => ({
  id: row.id,
  full_name: row.full_name,
  avatar_url: row.avatar_url,
});

/**
 * Retrieves and manages user-related data including access token, user details, and loading state.
 * It makes sure that the necessary data is fetched when a user is logged in and
 * cleaned up when a user is logged out. The provided context allows easy access
 * to user data throughout the application.
 *
 * @param props: any props to be passed to the context provider
 * @returns user context provider
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
          .single();

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

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // If hook is used outside of the context
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
