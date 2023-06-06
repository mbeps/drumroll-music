"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { Database } from "@/types/types_db";

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
    createClientComponentClient<Database>()
  ); // create a new instance of the Supabase client

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
