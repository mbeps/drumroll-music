import { NextRequest } from "next/server";

import { updateSupabaseSession } from "@/utils/supabase/middleware";

/**
 * Use Node.js runtime to support Supabase packages that use Node.js APIs.
 * Edge runtime doesn't support process.version and other Node.js globals.
 */
export const runtime = "nodejs";

/**
 * Keeps Supabase auth state in sync for every request.
 * @param request Incoming request
 * @returns NextResponse with refreshed session cookies
 */
export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
