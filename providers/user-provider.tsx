"use client";

/**
 * @fileoverview User profile and session context provider.
 * Wraps MyUserContextProvider to expose user details, profile data, and user-specific state.
 * Must wrap application tree after SupabaseProvider.
 *
 * @author Maruf Bepary
 * @see SupabaseProvider
 * @see MyUserContextProvider
 */

import { MyUserContextProvider } from "@/hooks/use-user";

/**
 * Props for the UserProvider component.
 */
interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Provides user profile and session context to the application.
 * Wraps and exposes MyUserContextProvider functionality for accessing current user details.
 * Should be placed inside SupabaseProvider and before feature components.
 *
 * @param props Component props with children to wrap.
 * @returns Provider component managing user context.
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
