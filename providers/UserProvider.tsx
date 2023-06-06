"use client";

import { MyUserContextProvider } from "@/hooks/useUser";

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Allows for user data and related functionality to be accessible to all components in the tree.
 *
 * @param {UserProviderProps}
 * @returns (JSX.Element): provider for user data and related functionality
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
