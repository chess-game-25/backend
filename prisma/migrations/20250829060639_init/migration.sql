-- CreateEnum
CREATE TYPE "public"."GameResult" AS ENUM ('WHITE_WINS', 'BLACK_WINS', 'DRAW');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "result" "public"."GameResult",
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "public"."User"("referralCode");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "public"."User"("rating");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
