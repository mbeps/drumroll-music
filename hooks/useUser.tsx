import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { UserDetails } from "@/types/types";
import {
  useSessionContext,
  useSupabaseUser,
} from "@/providers/SupabaseProvider";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

/**
 * Retrieves and manages user-related data including access token, user details, and loading state.
 * It makes sure that the necessary data is fetched when a user is logged in and
 * cleaned up when a user is logged out. The provided context allows easy access
 * to user data throughout the application.
 *
 * @param props: any props to be passed to the context provider
 * @returns user context provider
 */
export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupabaseUser(); // get logged in user (remapped name to avoid conflict)
  const accessToken = session?.access_token ?? null; // get access token
  const [isLoadingData, setIsLoadingData] = useState(false); // loading state for user details
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // user details

  useEffect(() => {
    if (!user) {
      if (!isLoadingUser && !isLoadingData) {
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

        setUserDetails((data as UserDetails) ?? null);
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to fetch user details:", error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingData(false);
        }
      }
    };

    fetchUserDetails();

    return () => {
      isCancelled = true;
    };
  }, [user, userDetails, isLoadingUser, supabase]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // If hook is used outside of the context
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
