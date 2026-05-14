import { createLogger, format, transports } from "winston";
import path from "node:path";
import fs from "node:fs";

const { combine, timestamp, printf, colorize, errors } = format;

// Logs directory (local only)
const logsDir = path.join(process.cwd(), "logs");

// Create logs folder if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Serialize Error objects
const serializeErrors = format((info) => {
  for (const key of Object.keys(info)) {
    if (info[key] instanceof Error) {
      info[key] = {
        message: info[key].message,
        stack: info[key].stack,
      };
    }
  }
  return info;
});

// Console format
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length
      ? " " + JSON.stringify(meta)
      : "";

    return `[${timestamp}] ${level}: ${message}${extra}`;
  })
);

// File format
const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  serializeErrors(),
  format.json()
);

const logger = createLogger({
  level: "http",
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),

    // Optional file logging
    new transports.File({
      filename: path.join(logsDir, "app.log"),
      format: fileFormat,
    }),
  ],
});

export default logger;