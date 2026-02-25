import { NextRequest } from "next/server";

import { updateSupabaseSession } from "@/utils/supabase/middleware";

/**
 * Keeps Supabase auth state in sync for every request.
 * Runs in the default Node.js runtime (Node.js globals are required by
 * @supabase/ssr; Edge runtime lacks process.version and other Node.js APIs).
 * @param request Incoming request
 * @returns NextResponse with refreshed session cookies
 */
export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
