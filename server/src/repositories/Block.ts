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
      await trx.deleteFrom("PublishedBlock").where("id", "=", id).execute();

      const result = await trx
        .deleteFrom("Block")
        .where("id", "=", id)
        .execute();

      return result;
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
    return db
      .insertInto("Block")
      .values(data)
      .returningAll()
      .executeTakeFirst();
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
