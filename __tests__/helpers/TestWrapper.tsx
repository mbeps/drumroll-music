import React from "react";
import SupabaseProvider from "@/providers/supabase-provider";
import UserProvider from "@/providers/user-provider";

/**
 * A test wrapper that provides the necessary context for components.
 * This can be used with `render(ui, { wrapper: TestWrapper })`.
 * 
 * NOTE: This uses the actual providers, which are mocked in `vitest.setup.tsx`.
 * If you need specific mock values, use `vi.mocked()` on the hooks.
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SupabaseProvider>
  );
};

export default TestWrapper;
