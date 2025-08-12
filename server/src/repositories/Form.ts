import { db } from "../config/db";
import { Form as TForm, Block as TBlock } from "../generated/prisma/kysely";

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

    console.log(flatResults);

    const form: FormWithBlocks = {
      // @ts-ignore
      id: flatResults[0].id as string,
      shortId: flatResults[0].shortId,
      // @ts-ignore
      createdAt: flatResults[0].createdAt,
      // @ts-ignore
      updatedAt: flatResults[0].updatedAt,
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
}

export default new Form();
