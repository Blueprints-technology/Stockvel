import { Prisma, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { logger } from "../utils/logger";

export async function seedUsers(tx: Prisma.TransactionClient) {
  logger.info("Seeding users...");

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@example.com";
  const adminRawPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "ChangeMe123!";
  const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@stockvel.com";

  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminRawPassword, 12),
    bcrypt.hash("Password123!", 12),
  ]);

  // Helper: seed user + profile with proper conflict handling
  const seedUser = async (
    email: string,
    passwordHash: string,
    role: Role,
    displayName: string,
    username: string,
    bio: string,
  ) => {
    // 1. Upsert user by email
    const user = await tx.user.upsert({
      where: { email },
      update: { passwordHash, role },
      create: { email, passwordHash, role },
    });

    // 2. Check if username is already taken by a DIFFERENT user
    const existingProfile = await tx.profile.findUnique({
      where: { username },
    });

    let finalUsername = username;
    if (existingProfile && existingProfile.userId !== user.id) {
      // Username conflict - generate a unique fallback
      finalUsername = `${username}_${Date.now().toString(36).slice(-4)}`;
      logger.warn(`Username "${username}" taken, using "${finalUsername}"`);
    }

    // 3. Now safely upsert profile by userId
    await tx.profile.upsert({
      where: { userId: user.id },
      update: { displayName, username: finalUsername, bio },
      create: { userId: user.id, displayName, username: finalUsername, bio },
    });

    // 4. Return user with fresh profile data
    return tx.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { profile: true },
    });
  };

  const [admin, demoUser] = await Promise.all([
    seedUser(
      adminEmail,
      adminHash,
      Role.ADMIN,
      "Platform Admin",
      "stockvel_admin",
      "Administrator for the Stockvel platform.",
    ),
    seedUser(
      demoEmail,
      userHash,
      Role.USER,
      "Demo Investor",
      "smart_naira_001",
      "Retail investor focused on Nigerian equities and major cryptocurrencies.",
    ),
  ]);

  logger.progress("Users", 2);
  return { admin, demoUser };
}
