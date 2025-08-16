import { Selectable, sql } from "kysely";
import { db } from "../config/db";
import { Form as TForm, Block as TBlock } from "../generated/prisma/kysely";
import ApiError from "../utils/ApiError";

type createFormInternal = { shortId: string };

type FormWithBlocks = Selectable<TForm> & {
  blocks: Array<Partial<Selectable<TBlock>>>;
};

class Form {
  async createForm(data: createFormInternal) {
    const newForm = await db
      .insertInto("Form")
      .values({ ...data, updatedAt: new Date() })
      .returningAll()
      .executeTakeFirstOrThrow();
    return newForm;
  }

  async getFormById(id: string) {
    const form = await db
      .selectFrom("Form")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
    return form;
  }

  async getFormWithBlocks(formId: string): Promise<FormWithBlocks | null> {
    const flatResults = await db
      .selectFrom("Form")
      .innerJoin("Block", "Form.shortId", "Block.formId")
      .selectAll()
      .select([
        "Block.id as block_id",
        "Block.title as block_title",
        "Block.titleLabel as block_titleLabel",
        "Block.type as block_type",
        "Block.position as block_position",
        "Block.formId as block_formId",
        "Block.textAlign as block_textAlign",
        "Block.required as block_required",
      ])
      .where("Form.shortId", "=", formId)
      .orderBy("Block.position", "asc")
      .execute();

    if (flatResults.length === 0) {
      return null;
    }

    const form: FormWithBlocks = {
      id: flatResults[0].id as string,
      shortId: flatResults[0].shortId,
      createdAt: flatResults[0].createdAt,
      updatedAt: flatResults[0].updatedAt,
      status: flatResults[0].status,
      blocks: [],
    };

    for (const row of flatResults) {
      if (row.block_id) {
        form.blocks.push({
          id: row.block_id,
          title: row.block_title,
          titleLabel: row.block_titleLabel,
          required: row.block_required as boolean,
          formId: row.shortId,
          type: row.block_type,
          position: row.block_position,
        });
      }
    }
    return form;
  }

  async getFormByShortId(shortId: string) {
    const form = await db
      .selectFrom("Form")
      .selectAll()
      .where("shortId", "=", shortId)
      .executeTakeFirstOrThrow();
    return form;
  }

  async getCurrentAndAdjacentBlocks(
    currentBlockId: string,
    prevOrNext = "after"
  ) {
    return await db.transaction().execute(async (trx) => {
      const isNext = prevOrNext === "after";
      const positionOp = isNext ? ">" : "<";
      const orderDirection = isNext ? "asc" : "desc";

      const currentBlockDetails = await trx
        .selectFrom("Block")
        .select(["id", "formId", "position"])
        .where("id", "=", currentBlockId)
        .executeTakeFirst();

      if (!currentBlockDetails) {
        throw new Error(`Block with ID ${currentBlockId} not found.`);
      }

      const { id, formId, position } = currentBlockDetails;

      const result = await trx
        .selectFrom("Block")
        .selectAll()
        .where((eb) =>
          eb.or([
            eb("id", "=", id),
            eb.and([
              eb("formId", "=", formId),
              eb("position", positionOp, position),
            ]),
          ])
        )
        .orderBy("position", orderDirection)
        .limit(2)
        .execute();

      return result;
    });
  }

  // publish form
  async publishForm(shortId: string) {
    await db.transaction().execute(async (trx) => {
      // 1. Publish the form
      const form = await trx
        .updateTable("Form")
        .set({ status: "publish" })
        .where("shortId", "=", shortId)
        .returningAll()
        .executeTakeFirstOrThrow();

      // 2. Fetch all blocks + options for this form
      const blocks = await trx
        .selectFrom("Block")
        .selectAll()
        .where("formId", "=", shortId)
        .execute();

      if (blocks.length === 0) return form;

      // all blockIds
      const blockIds = blocks.map((b) => b.id);

      // all blockOptions for these blocks
      const blockOptions = await trx
        .selectFrom("BlockOption")
        .selectAll()
        .where("blockId", "in", blockIds)
        .execute();

      // 3. update if exists, insert if not
      for (const block of blocks) {
        const { createdAt, updatedAt, ...copyBlockData } = block;
        const updatedBlockData = {
          ...copyBlockData,
          updatedAt: new Date(),
        };
        const updated = await trx
          .updateTable("PublishedBlock")
          .set(updatedBlockData)
          .where("id", "=", block.id)
          .executeTakeFirst();

        if (!updated?.numUpdatedRows || Number(updated.numUpdatedRows) === 0) {
          await trx
            .insertInto("PublishedBlock")
            .values(updatedBlockData)
            .execute();
        }
      }

      // 4. CopyBlockOption (insert/update/delete)
      for (const blockId of blockIds) {
        const sourceOptions = blockOptions.filter(
          (opt) => opt.blockId === blockId
        );

        // Get existing copyBlockOptions for this block
        const existingOptions = await trx
          .selectFrom("PublishedBlockOption")
          .selectAll()
          .where("publishedBlockId", "=", blockId)
          .execute();

        const existingIds = new Set(existingOptions.map((opt) => opt.id));
        const sourceIds = new Set(sourceOptions.map((opt) => opt.id));

        // 4.1 Insert or update options
        for (const opt of sourceOptions) {
          const { blockId: publishedBlockId, ...restCommonOption } = opt;
          if (existingIds.has(opt.id)) {
            // update
            await trx
              .updateTable("PublishedBlockOption")
              .set(opt)
              .where("id", "=", opt.id)
              .execute();
          } else {
            // insert
            await trx
              .insertInto("PublishedBlockOption")
              .values({ ...restCommonOption, publishedBlockId })
              .execute();
          }
        }

        // 4.2 remove options no longer present in source
        const toDelete = [...existingIds].filter((id) => !sourceIds.has(id));
        if (toDelete.length > 0) {
          await trx
            .deleteFrom("PublishedBlockOption")
            .where("id", "in", toDelete)
            .execute();
        }
      }

      return form;
    });
  }

  // get paginated published blocks
  async getPaginatedPublishedBlocks(
    shortId: string,
    page: number,
    limit: number
  ) {
    const blocks = await db
      .selectFrom("PublishedBlock")
      .selectAll()
      .where("formId", "=", shortId)
      .orderBy("position", "asc")
      .limit(limit)
      .offset((page - 1) * limit)
      .executeTakeFirstOrThrow();
    const countResult = await db
      .selectFrom("PublishedBlock")
      .select(sql<number>`count(*)`.as("totalCount"))
      .where("formId", "=", shortId)
      .executeTakeFirst();

    // Todo if response is there send that back as well

    const totalCount = countResult?.totalCount ?? 0;
    return {
      blocks,
      totalPages: Math.ceil(totalCount / limit),
      totalBlockCount: totalCount,
      page,
      limit,
    };
  }

  // +++++++++++++++++++++++++++++++++++++++Response+++++++++++++++++++++++++++++++++++++++
  async createResponse(shortFormId: string) {
    return await db
      .insertInto("Response")
      .values({ formId: shortFormId })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async createResponseValues(
    responseId: string,
    ResponseData: {
      submissions?: Record<string, { value: string; publishedBlockId: string }>;
    }
  ) {
    if (!ResponseData.submissions) {
      console.warn("No submissions found in ResponseData");
      throw new Error("Submissions not found in ResponseData");
    }

    await db.transaction().execute(async (trx) => {
      for (const [blockId, valueObject] of Object.entries(
        // @ts-ignore
        ResponseData.submissions
      )) {
        await trx
          .insertInto("ResponseValue")
          .values({
            responseId,
            publishedBlockId: blockId,
            value: String(valueObject.value),
            type: "STRING",
          })
          .execute();
      }
    });
  }

  // +++++++++++++++++++++++++++++++++++++++END OF CLASS+++++++++++++++++++++++++++++++++++++++
}

export default new Form();
