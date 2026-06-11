const timestamp = () => new Date().toISOString();

export const logger = {
  info: (msg: string) =>
    console.log(`\x1b[36m[SEED]\x1b[0m ${timestamp()} ${msg}`),
  success: (msg: string) =>
    console.log(`\x1b[32m[SEED ✓]\x1b[0m ${timestamp()} ${msg}`),
  warn: (msg: string) =>
    console.warn(`\x1b[33m[SEED ⚠]\x1b[0m ${timestamp()} ${msg}`),
  error: (msg: string, err?: unknown) =>
    console.error(`\x1b[31m[SEED ✗]\x1b[0m ${timestamp()} ${msg}`, err ?? ""),
  progress: (entity: string, count: number) =>
    console.log(
      `\x1b[36m[SEED]\x1b[0m ${timestamp()} ${entity}: \x1b[33m${count}\x1b[0m records`,
    ),
  section: (title: string) =>
    console.log(
      `\n\x1b[35m${"─".repeat(50)}\x1b[0m\n\x1b[35m  ${title}\x1b[0m\n\x1b[35m${"─".repeat(50)}\x1b[0m`,
    ),
};
