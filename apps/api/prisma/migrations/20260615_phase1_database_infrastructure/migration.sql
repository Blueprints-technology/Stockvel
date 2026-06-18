-- Alter existing user table
ALTER TABLE "User"
ADD COLUMN "tier" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN "reputation" INTEGER NOT NULL DEFAULT 0;

-- Create subscription table
CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "expiryDate" TIMESTAMP(3),
  "paystackRef" TEXT,
  "stripeRef" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_paystackRef_key" ON "Subscription"("paystackRef");
CREATE UNIQUE INDEX "Subscription_stripeRef_key" ON "Subscription"("stripeRef");
CREATE INDEX "Subscription_plan_status_idx" ON "Subscription"("plan", "status");
CREATE INDEX "Subscription_expiryDate_idx" ON "Subscription"("expiryDate");

ALTER TABLE "Subscription"
ADD CONSTRAINT "Subscription_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create market alerts table
CREATE TABLE "MarketAlert" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "assetType" "AssetType" NOT NULL,
  "assetSymbol" TEXT NOT NULL,
  "condition" TEXT NOT NULL,
  "targetValue" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "triggered" BOOLEAN NOT NULL DEFAULT false,
  "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
  "notifyInApp" BOOLEAN NOT NULL DEFAULT true,
  "lastTriggeredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MarketAlert_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketAlert_userId_isActive_idx" ON "MarketAlert"("userId", "isActive");
CREATE INDEX "MarketAlert_assetType_assetSymbol_idx" ON "MarketAlert"("assetType", "assetSymbol");
CREATE INDEX "MarketAlert_condition_idx" ON "MarketAlert"("condition");

ALTER TABLE "MarketAlert"
ADD CONSTRAINT "MarketAlert_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create chart workspaces table
CREATE TABLE "ChartWorkspace" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "layoutConfig" JSONB NOT NULL DEFAULT '{}',
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChartWorkspace_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChartWorkspace_userId_name_key" ON "ChartWorkspace"("userId", "name");
CREATE INDEX "ChartWorkspace_userId_isDefault_idx" ON "ChartWorkspace"("userId", "isDefault");

ALTER TABLE "ChartWorkspace"
ADD CONSTRAINT "ChartWorkspace_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create drawing objects table
CREATE TABLE "DrawingObject" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "assetSymbol" TEXT NOT NULL,
  "toolType" TEXT NOT NULL,
  "coordinates" JSONB NOT NULL,
  "styles" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DrawingObject_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DrawingObject_workspaceId_idx" ON "DrawingObject"("workspaceId");
CREATE INDEX "DrawingObject_assetSymbol_idx" ON "DrawingObject"("assetSymbol");

ALTER TABLE "DrawingObject"
ADD CONSTRAINT "DrawingObject_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "ChartWorkspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indicator presets table
CREATE TABLE "IndicatorPreset" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "indicatorsConfig" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IndicatorPreset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IndicatorPreset_userId_name_key" ON "IndicatorPreset"("userId", "name");
CREATE INDEX "IndicatorPreset_userId_idx" ON "IndicatorPreset"("userId");

ALTER TABLE "IndicatorPreset"
ADD CONSTRAINT "IndicatorPreset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create audit logs table
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create follows table
CREATE TABLE "Follow" (
  "id" TEXT NOT NULL,
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

ALTER TABLE "Follow"
ADD CONSTRAINT "Follow_followerId_fkey"
FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Follow"
ADD CONSTRAINT "Follow_followingId_fkey"
FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create market ideas table
CREATE TABLE "MarketIdea" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "assetSymbol" TEXT NOT NULL,
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "downvotes" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MarketIdea_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketIdea_userId_createdAt_idx" ON "MarketIdea"("userId", "createdAt");
CREATE INDEX "MarketIdea_assetSymbol_idx" ON "MarketIdea"("assetSymbol");
CREATE INDEX "MarketIdea_upvotes_downvotes_idx" ON "MarketIdea"("upvotes", "downvotes");

ALTER TABLE "MarketIdea"
ADD CONSTRAINT "MarketIdea_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create AI insights table
CREATE TABLE "AiInsight" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiInsight_type_createdAt_idx" ON "AiInsight"("type", "createdAt");
