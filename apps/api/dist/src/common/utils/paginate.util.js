"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
function getPagination(query) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
}
//# sourceMappingURL=paginate.util.js.map