"use client";

import { useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

/**
 * Provides an instance of the Supabase client.
 * This allows for access to the Supabase client throughout the application without having to recreate a new instance each time.
 *
 * @param {SupabaseProviderProps}: children who need access to the Supabase client
 * @returns {React.FC}: a component that provides the Supabase client to its children
 */
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient()
  ); // create a new instance of the Supabase client

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
