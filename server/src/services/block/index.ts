import { db } from "../../config/db";
import fs from "node:fs";
import path from "node:path";
import ApiError from "../../utils/ApiError";
import { MinimumBlockInForm } from "../../constants";
import formRespository from "../../repositories/Form";
import { sql } from "kysely";

export async function getBlockByIdService(id: string) {
  try {
    const block = await db
      .selectFrom("Block")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
    return block;
  } catch (error) {
    console.log("Error while getting block by id => ", error);
    throw new Error("Error while getting block by id");
  }
}

export async function updateBlockFieldService(id: string, data: any) {
  try {
    // const block = await db
    //   .updateTable("Block")
    //   .set(data)
    //   .where("id", "=", id)
    //   .returningAll()
    //   .executeTakeFirstOrThrow();
    console.log("from updateBlockFieldService", data);
    const block = await db
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
      .executeTakeFirstOrThrow();

    return block;
  } catch (error) {
    console.log("Error while updating block by id => ", error);
    throw new Error("Error while updating block by id");
  }
}

export async function deleteBlockService(id: string) {
  try {
    // Check count of blocks in form
    const result = await db
      .selectFrom("Block")
      .select(({ fn, selectFrom }) => [fn.countAll<number>().as("blockCount")])
      .where(
        "formId",
        "=",
        db.selectFrom("Block").select("formId").where("id", "=", id)
      )
      .executeTakeFirst();

    if ((result?.blockCount || 0) <= MinimumBlockInForm) {
      console.log("error throw");
      throw new ApiError(
        400,
        `Form must have at least ${MinimumBlockInForm} blocks`
      );
    }

    await db.deleteFrom("Block").where("id", "=", id).execute();
  } catch (error) {
    console.log("Error while deleting block by id => ", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Error while deleting block by id");
  }
}
export async function deleteBlockFileService(id: string) {
  try {
    const block = await db
      .selectFrom("Block")
      .select("coverImagePath")
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    if (block.coverImagePath) {
      const filePath = block.coverImagePath.replace("/", "\\");
      const fullPath = path.join("public", filePath);
      fs.unlinkSync(fullPath);
      const newBlock = await db
        .updateTable("Block")
        .set({ coverImagePath: null, coverImageOrigin: null })
        .where("id", "=", id)
        .executeTakeFirstOrThrow();
      return newBlock;
    }
  } catch (error) {
    console.log("Error while deleting block by id => ", error);
    throw new Error("Error while deleting block by id");
  }
}

export async function duplicateBlockService(id: string) {
  try {
    const currentAndAdjacentBlocks =
      await formRespository.getCurrentAndAdjacentBlocks(id);
    console.log("currentAndAdjacentBlocks", currentAndAdjacentBlocks);
    const currentBlock = currentAndAdjacentBlocks.find(
      (block) => block.id === id
    );
    let newBlockPosition;
    const nextBlock = currentAndAdjacentBlocks.find((block) => block.id !== id);
    if (!currentBlock) throw new ApiError(404, "Block not found");
    if (!nextBlock) newBlockPosition = currentBlock.position + 100;
    else newBlockPosition = (nextBlock.position + currentBlock.position) / 2;

    const {
      id: _,
      updatedAt: __,
      createdAt: ___,
      ...newBlockData
    } = currentBlock;

    const newBlock = await db
      .insertInto("Block")
      .values({
        ...newBlockData,
        position: newBlockPosition,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newBlock;
  } catch (error) {
    console.log("Error while duplicating block by id => ", error);
    if (error instanceof ApiError) throw error;
    throw new Error("Error while duplicating block by id");
  }
}
