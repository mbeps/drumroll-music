/**
 * Next.js Instrumentation Hook.
 * This file is automatically executed by Next.js when the server starts.
 * It is used to initialize server-side services like logging.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { configureLogging } = await import("@/lib/logger");
    await configureLogging();
  }
}
