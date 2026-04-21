/**
 * Structured logger for the LMS backend.
 *
 * - JSON output in production  (easy to ingest by Railway / Datadog / Logtail)
 * - ANSI-coloured output in development for readability
 *
 * Usage:
 *   import { logger } from "../lib/logger.js";
 *   logger.info("[Enrollments] User enrolled", { userId, courseSlug });
 *   logger.error("[Payments] Payment failed", { error: err.message });
 */

const IS_PROD = process.env.NODE_ENV === "production";

// ANSI colour codes for dev output
const COLOURS = {
  INFO:  "\x1b[32m", // green
  WARN:  "\x1b[33m", // yellow
  ERROR: "\x1b[31m", // red
  DEBUG: "\x1b[36m", // cyan
} as const;
const RESET = "\x1b[0m";

type LogLevel = keyof typeof COLOURS;
type Meta = Record<string, unknown>;

function emit(level: LogLevel, message: string, meta?: Meta) {
  const timestamp = new Date().toISOString();

  if (IS_PROD) {
    // Structured JSON: one line per entry, easy for log aggregators to parse
    process.stdout.write(
      JSON.stringify({ level, timestamp, message, ...(meta ?? {}) }) + "\n"
    );
  } else {
    const colour = COLOURS[level];
    const prefix = `${colour}[${level}]${RESET} ${timestamp}`;
    const logFn =
      level === "ERROR" ? console.error
      : level === "WARN"  ? console.warn
      : level === "DEBUG" ? console.debug
      : console.log;

    if (meta && Object.keys(meta).length > 0) {
      logFn(`${prefix} ${message}`, meta);
    } else {
      logFn(`${prefix} ${message}`);
    }
  }
}

class Logger {
  info(message: string, meta?: Meta)  { emit("INFO",  message, meta); }
  warn(message: string, meta?: Meta)  { emit("WARN",  message, meta); }
  error(message: string, meta?: Meta) { emit("ERROR", message, meta); }
  debug(message: string, meta?: Meta) {
    if (!IS_PROD || process.env.LOG_LEVEL === "debug") {
      emit("DEBUG", message, meta);
    }
  }
}

export const logger = new Logger();
