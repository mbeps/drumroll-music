import { useContext } from "react";
import { UserContext, type UserContextType } from "@/providers/user-provider";

/**
 * Returns the current user context including auth state and profile details.
 * Must be called inside a UserProvider; throws otherwise.
 *
 * @returns The current UserContextType with accessToken, user, userDetails, and isLoading.
 * @throws {Error} When called outside of a UserProvider.
 * @author Maruf Bepary
 */
export default function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
}
