/*
  Warnings:

  - Added the required column `publishedBlockId` to the `ResponseValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ResponseValue" ADD COLUMN     "publishedBlockId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "public"."PublishedBlock" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "titleLabel" "public"."TitleLabelType" NOT NULL,
    "descriptionDelta" JSONB,
    "descriptionHtml" TEXT,
    "textAlign" "public"."AlignType",
    "buttonText" TEXT,
    "coverImageOrigin" TEXT,
    "coverImagePath" TEXT,
    "coverImageLayout" "public"."CoverImageLayout",
    "required" BOOLEAN DEFAULT false,
    "optionalConfig" JSONB,
    "formId" VARCHAR(8) NOT NULL,
    "type" "public"."BlockType" NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,
    "placeholder" TEXT,
    "urlParameter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishedBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublishedBlockOption" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "publishedBlockId" UUID NOT NULL,

    CONSTRAINT "PublishedBlockOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublishedBlock_formId_position_idx" ON "public"."PublishedBlock"("formId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedBlock_formId_position_key" ON "public"."PublishedBlock"("formId", "position");

-- CreateIndex
CREATE INDEX "PublishedBlockOption_publishedBlockId_idx" ON "public"."PublishedBlockOption"("publishedBlockId");

-- CreateIndex
CREATE INDEX "ResponseValue_publishedBlockId_idx" ON "public"."ResponseValue"("publishedBlockId");

-- AddForeignKey
ALTER TABLE "public"."ResponseValue" ADD CONSTRAINT "ResponseValue_publishedBlockId_fkey" FOREIGN KEY ("publishedBlockId") REFERENCES "public"."PublishedBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PublishedBlock" ADD CONSTRAINT "PublishedBlock_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("shortId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PublishedBlockOption" ADD CONSTRAINT "PublishedBlockOption_publishedBlockId_fkey" FOREIGN KEY ("publishedBlockId") REFERENCES "public"."PublishedBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
