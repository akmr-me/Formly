-- CreateEnum
CREATE TYPE "public"."BlockType" AS ENUM ('statement', 'shortText', 'longText', 'number', 'websiteUrl', 'single', 'multi', 'dropdown', 'date', 'address');

-- CreateEnum
CREATE TYPE "public"."AlignType" AS ENUM ('left', 'center', 'right');

-- CreateEnum
CREATE TYPE "public"."TitleLabelType" AS ENUM ('Title', 'Question');

-- CreateEnum
CREATE TYPE "public"."ValueType" AS ENUM ('STRING', 'NUMBER', 'DATE', 'JSON');

-- CreateTable
CREATE TABLE "public"."Form" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shortId" VARCHAR(8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Block" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "titleLabel" "public"."TitleLabelType" NOT NULL,
    "descriptionDelta" JSONB,
    "descriptionHtml" TEXT,
    "textAlign" "public"."AlignType",
    "buttonText" TEXT,
    "coverImageOrigin" TEXT,
    "coverImagePath" TEXT,
    "required" BOOLEAN DEFAULT false,
    "optionalConfig" JSONB,
    "formId" VARCHAR(8) NOT NULL,
    "type" "public"."BlockType" NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,
    "placeholder" TEXT,
    "urlParameter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlockOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "blockId" UUID NOT NULL,

    CONSTRAINT "BlockOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Response" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "formId" VARCHAR(8) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResponseValue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "responseId" UUID NOT NULL,
    "blockId" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "type" "public"."ValueType" NOT NULL,

    CONSTRAINT "ResponseValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Form_shortId_idx" ON "public"."Form"("shortId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_shortId_key" ON "public"."Form"("shortId");

-- CreateIndex
CREATE INDEX "Block_formId_position_idx" ON "public"."Block"("formId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Block_formId_position_key" ON "public"."Block"("formId", "position");

-- CreateIndex
CREATE INDEX "BlockOption_blockId_idx" ON "public"."BlockOption"("blockId");

-- CreateIndex
CREATE INDEX "ResponseValue_responseId_idx" ON "public"."ResponseValue"("responseId");

-- CreateIndex
CREATE INDEX "ResponseValue_blockId_idx" ON "public"."ResponseValue"("blockId");

-- AddForeignKey
ALTER TABLE "public"."Block" ADD CONSTRAINT "Block_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("shortId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockOption" ADD CONSTRAINT "BlockOption_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("shortId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResponseValue" ADD CONSTRAINT "ResponseValue_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResponseValue" ADD CONSTRAINT "ResponseValue_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
