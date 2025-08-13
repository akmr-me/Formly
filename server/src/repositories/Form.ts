import { sql } from "kysely";
import { db } from "../config/db";
import { Form as TForm, Block as TBlock } from "../generated/prisma/kysely";
import ApiError from "../utils/ApiError";

type createFormInternal = { shortId: string };

type FormWithBlocks = TForm & {
  blocks: Partial<TBlock>[];
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
    console.log("fromid", formId);
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
      ])
      .where("Form.shortId", "=", formId)
      .execute();

    if (flatResults.length === 0) {
      return null;
    }

    const form: FormWithBlocks = {
      // @ts-ignore
      id: flatResults[0].id as string,
      shortId: flatResults[0].shortId,
      // @ts-ignore
      createdAt: flatResults[0].createdAt,
      // @ts-ignore
      updatedAt: flatResults[0].updatedAt,
      // @ts-ignore
      status: flatResults[0].status,
      blocks: [],
    };

    for (const row of flatResults) {
      if (row.block_id) {
        form.blocks.push({
          // @ts-ignore
          id: row.block_id,
          title: row.block_title,
          titleLabel: row.block_titleLabel,
          // descriptionDelta: row.block_descriptionDelta,
          // descriptionHtml: row.block_descriptionHtml,
          // textAlign: row.block_textAlign,
          // buttonText: row.block_buttonText,
          // coverImageOrigin: row.block_coverImageOrigin,
          // coverImagePath: row.block_coverImagePath,
          // required: row.block_required,
          // optionalConfig: row.block_optionalConfig,
          formId: row.shortId,
          type: row.block_type,
          position: row.block_position,
          // placeholder: row.block_placeholder,
          // urlParameter: row.block_urlParameter,
          // createdAt: row.block_createdAt,
          // updatedAt: row.block_updatedAt,
          // blockOptions: [], // Assuming you might want to join these later
          // responses: [], // Assuming you might want to join these later
        });
      }
    }
    return form;
  }

  async getFormByShortId(shortId: string) {
    const form = await db
      .selectFrom("Form") // Use PascalCase
      .selectAll()
      .where("shortId", "=", shortId)
      .executeTakeFirstOrThrow();
    return form;
  }

  async getCurrentAndAdjacentBlocks(
    currentBlockId: string,
    prevOrNext = "next"
  ) {
    // TODO: Optimize query
    try {
      const isNext = prevOrNext === "next";
      const positionOp = isNext ? ">" : "<";
      const orderDirection = isNext ? "asc" : "desc";

      const currentBlockDetails = await db
        .selectFrom("Block")
        .select(["id", "formId", "position"])
        .where("id", "=", currentBlockId)
        .executeTakeFirst();

      if (!currentBlockDetails) {
        console.error(`Block with ID ${currentBlockId} not found.`);
        throw new Error("Block not found");
      }

      const { id, formId, position } = currentBlockDetails;

      const result = await db
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

      console.log("result", result);
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error fetching blocks:", error);
      throw error;
    }
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
    const form = await db
      .selectFrom("PublishedBlock")
      .selectAll()
      .where("formId", "=", shortId)
      .limit(limit)
      .offset((page - 1) * limit)
      .executeTakeFirstOrThrow();
    const countResult = await db
      .selectFrom("PublishedBlock")
      .select(sql<number>`count(*)`.$as("totalCount"))
      .where("formId", "=", shortId)
      .executeTakeFirst();

    const totalCount = countResult?.totalCount ?? 0;
    return form;
  }
}

export default new Form();
