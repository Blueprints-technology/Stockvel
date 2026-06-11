"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const timestamp = () => new Date().toISOString();
exports.logger = {
    info: (msg) => console.log(`\x1b[36m[SEED]\x1b[0m ${timestamp()} ${msg}`),
    success: (msg) => console.log(`\x1b[32m[SEED ✓]\x1b[0m ${timestamp()} ${msg}`),
    warn: (msg) => console.warn(`\x1b[33m[SEED ⚠]\x1b[0m ${timestamp()} ${msg}`),
    error: (msg, err) => console.error(`\x1b[31m[SEED ✗]\x1b[0m ${timestamp()} ${msg}`, err ?? ""),
    progress: (entity, count) => console.log(`\x1b[36m[SEED]\x1b[0m ${timestamp()} ${entity}: \x1b[33m${count}\x1b[0m records`),
    section: (title) => console.log(`\n\x1b[35m${"─".repeat(50)}\x1b[0m\n\x1b[35m  ${title}\x1b[0m\n\x1b[35m${"─".repeat(50)}\x1b[0m`),
};
//# sourceMappingURL=logger.js.map