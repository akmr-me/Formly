-- CreateEnum
CREATE TYPE "public"."CoverImageLayout" AS ENUM ('stack', 'split', 'wallpaper');

-- AlterTable
ALTER TABLE "public"."Block" ADD COLUMN     "coverImageLayout" "public"."CoverImageLayout";
