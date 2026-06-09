"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCsrfToken = createCsrfToken;
const crypto_1 = require("crypto");
function createCsrfToken(seed) {
    return (0, crypto_1.createHash)('sha256').update(`${seed ?? 'csrf'}:${(0, crypto_1.randomBytes)(32).toString('hex')}`).digest('hex');
}
//# sourceMappingURL=csrf.util.js.map