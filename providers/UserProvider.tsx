"use client";

import { MyUserContextProvider } from "@/hooks/useUser";

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Higher-level wrapper for MyUserContextProvider.
 *
 * Provides user-related context and functionality to the application tree.
 *
 * @author Maruf Bepary
 * @see MyUserContextProvider
 * @param children - React components to be wrapped by the provider.
 * @returns React developer component providing user context.
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
