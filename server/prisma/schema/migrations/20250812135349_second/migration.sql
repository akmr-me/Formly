-- CreateEnum
CREATE TYPE "public"."PublishStatusType" AS ENUM ('publish', 'draft');

-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "status" "public"."PublishStatusType" NOT NULL DEFAULT 'draft';


-- Adding default updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP(3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_updated_at ON "public"."Block";

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON "public"."Block"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Form

CREATE OR REPLACE FUNCTION update_updated_at_column_form()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP(3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_updated_at ON "public"."Form";

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON "public"."Form"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column_form();

-- Changing status of form when updating blocks

CREATE OR REPLACE FUNCTION update_form_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "public"."Form"
  SET "status" = 'draft'
  WHERE "shortId" = NEW."formId" AND "status" = 'publish';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_form_status ON "public"."Block";

CREATE TRIGGER trigger_update_form_status
AFTER UPDATE ON "public"."Block"
FOR EACH ROW
EXECUTE FUNCTION update_form_status();


