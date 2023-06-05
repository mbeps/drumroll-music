import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

import { UserDetails, Subscription } from "@/types/types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

/**
 * Retrieves and manages user-related data including access token, user details, loading state, and subscription.
 * It makes sure that the necessary data is fetched when a user is logged in,
 * and cleaned up when a user is logged out.
 * The provided context allows for easy access to user data throughout the application.
 * The built-in useUser hook is not used as it does not handle the subscription data.
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
  const user = useSupaUser(); // get logged in user (remapped name to avoid conflict)
  const accessToken = session?.access_token ?? null; // get access token
  const [isLoadingData, setIsLoadingData] = useState(false); // loading state for user details and subscription
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // user details
  const [subscription, setSubscription] = useState<Subscription | null>(null); // subscription

  const getUserDetails = () => supabase.from("users").select("*").single(); // get user details for logged in user
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single(); // get subscription for logged in user

  useEffect(() => {
    //  if the user is logged in, finished loading and has no subscription or user details
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fulfilled")
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === "fulfilled")
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsLoadingData(false);
        }
      );
      // no user
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
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
