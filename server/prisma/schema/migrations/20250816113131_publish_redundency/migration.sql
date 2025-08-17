/*
  Warnings:

  - You are about to drop the column `blockId` on the `ResponseValue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ResponseValue" DROP CONSTRAINT "ResponseValue_blockId_fkey";

-- DropIndex
DROP INDEX "public"."ResponseValue_blockId_idx";

-- AlterTable
ALTER TABLE "public"."ResponseValue" DROP COLUMN "blockId";
