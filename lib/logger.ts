import { configure, getConsoleSink, getLogger, type LogLevel } from "@logtape/logtape";
import { env } from "@/lib/env";

let initialized = false;

/**
 * Configures the LogTape logging system.
 * This should be called exactly once during the application startup.
 * It sets up a console sink and configures the default application logger.
 * 
 * @returns {Promise<void>}
 */
export async function configureLogging(): Promise<void> {
  if (initialized) return;

  await configure({
    sinks: {
      console: getConsoleSink(),
    },
    loggers: [
      {
        category: ["app"],
        lowestLevel: (env.LOG_LEVEL || "info") as LogLevel,
        sinks: ["console"],
      },
    ],
  });

  initialized = true;
}

/**
 * Export getLogger from LogTape for convenience and consistent category prefixi
ng.
 */
export { getLogger };
