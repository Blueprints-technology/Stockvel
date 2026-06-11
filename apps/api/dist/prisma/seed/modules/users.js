"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const logger_1 = require("../utils/logger");
async function seedUsers(tx) {
    logger_1.logger.info("Seeding users...");
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@example.com";
    const adminRawPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "ChangeMe123!";
    const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@stockvel.com";
    const [adminHash, userHash] = await Promise.all([
        bcrypt.hash(adminRawPassword, 12),
        bcrypt.hash("Password123!", 12),
    ]);
    const seedUser = async (email, passwordHash, role, displayName, username, bio) => {
        const user = await tx.user.upsert({
            where: { email },
            update: { passwordHash, role },
            create: { email, passwordHash, role },
        });
        const existingProfile = await tx.profile.findUnique({
            where: { username },
        });
        let finalUsername = username;
        if (existingProfile && existingProfile.userId !== user.id) {
            finalUsername = `${username}_${Date.now().toString(36).slice(-4)}`;
            logger_1.logger.warn(`Username "${username}" taken, using "${finalUsername}"`);
        }
        await tx.profile.upsert({
            where: { userId: user.id },
            update: { displayName, username: finalUsername, bio },
            create: { userId: user.id, displayName, username: finalUsername, bio },
        });
        return tx.user.findUniqueOrThrow({
            where: { id: user.id },
            include: { profile: true },
        });
    };
    const [admin, demoUser] = await Promise.all([
        seedUser(adminEmail, adminHash, client_1.Role.ADMIN, "Platform Admin", "stockvel_admin", "Administrator for the Stockvel platform."),
        seedUser(demoEmail, userHash, client_1.Role.USER, "Demo Investor", "smart_naira_001", "Retail investor focused on Nigerian equities and major cryptocurrencies."),
    ]);
    logger_1.logger.progress("Users", 2);
    return { admin, demoUser };
}
//# sourceMappingURL=users.js.map