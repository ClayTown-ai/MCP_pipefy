import pino from "pino";
import { config } from "./config.js";

export const logger = pino({
  level: config.log.level,
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino/file", options: { destination: 2 } } // stderr so it doesn't pollute stdio
      : undefined,
  redact: {
    paths: ["token", "authorization", "*.token", "*.authorization"],
    censor: "[REDACTED]",
  },
});
