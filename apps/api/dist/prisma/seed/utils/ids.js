"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deterministicId = deterministicId;
exports.generateSlug = generateSlug;
const uuid_1 = require("uuid");
const SEED_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
function deterministicId(name) {
    return (0, uuid_1.v5)(name, SEED_NAMESPACE);
}
function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
//# sourceMappingURL=ids.js.map