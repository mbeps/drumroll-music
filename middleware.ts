import { NextRequest } from "next/server";

import { updateSupabaseSession } from "@/utils/supabase/middleware";

/**
 * Keeps Supabase auth state in sync for every request.
 * @param request Incoming request
 * @returns NextResponse with refreshed session cookies
 */
export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}
