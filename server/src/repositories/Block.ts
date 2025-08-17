import { db } from "../config/db";
import { sql } from "kysely";

class BlockRepository {
  async getBlockById(id: string) {
    return db
      .selectFrom("Block")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async updateBlockById(id: string, data: any) {
    return db
      .updateTable("Block")
      .set({
        ...data,
        ...(data.optionalConfig && {
          optionalConfig: sql`coalesce("optionalConfig", '{}'::jsonb) || ${JSON.stringify(
            data.optionalConfig
          )}::jsonb`,
        }),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async deleteBlockById(id: string) {
    return db.transaction().execute(async (trx) => {
      const block = await trx
        .selectFrom("Block")
        .select(["formId"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!block) throw new Error("Block not found");

      await trx.deleteFrom("Block").where("id", "=", id).execute();

      await trx
        .updateTable("Form")
        .set({ status: "draft" })
        .where("shortId", "=", block.formId)
        .execute();

      return { success: true };
    });
  }

  async getBlockFileById(id: string) {
    return db
      .selectFrom("Block")
      .select("coverImagePath")
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async deleteBlockFileById(id: string) {
    return db
      .updateTable("Block")
      .set({ coverImagePath: null, coverImageOrigin: null })
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async insertBlock(data: any) {
    return db.transaction().execute(async (trx) => {
      const block = await trx
        .insertInto("Block")
        .values(data)
        .returningAll()
        .executeTakeFirst();

      if (!block) throw new Error("Failed to insert block");

      await trx
        .updateTable("Form")
        .set({ status: "draft" })
        .where("shortId", "=", block.formId)
        .execute();

      return block;
    });
  }

  async countBlocksInFormByBlockId(id: string) {
    return db
      .selectFrom("Block")
      .select(({ fn }) => [fn.countAll<number>().as("blockCount")])
      .where(
        "formId",
        "=",
        db.selectFrom("Block").select("formId").where("id", "=", id)
      )
      .executeTakeFirst();
  }
}

export default new BlockRepository();
