import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * Backend Supabase has no restriction for loading songs for unauthenticated users.
 * If this functionality is changed in the backend, this will capture it.
 * @param req
 * @returns
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
