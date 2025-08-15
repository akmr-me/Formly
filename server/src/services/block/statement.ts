import { db } from "../../config/db";
import formRespository from "../../repositories/Form";
import ApiError from "../../utils/ApiError";

export async function createStatementBlockService(data: any) {
  try {
    // data.position = 100;
    data.updatedAt = new Date();
    console.log("data", data);

    const { referenceBlockId, newBlockPosition, ...rest } = data;

    data = rest;

    let position = data.position;

    if (!position) {
      console.log("postion");
      const currentAndAdjacentBlocks =
        await formRespository.getCurrentAndAdjacentBlocks(referenceBlockId);
      console.log("currentAndAdjacentBlocks", currentAndAdjacentBlocks);
      const currentBlock = currentAndAdjacentBlocks.find(
        (block) => block.id === referenceBlockId
      );
      const nextBlock = currentAndAdjacentBlocks.find(
        (block) => block.id !== referenceBlockId
      );
      if (!currentBlock) throw new ApiError(404, "Block not found");
      if (!nextBlock) position = currentBlock.position + 100;
      else position = (nextBlock.position + currentBlock.position) / 2;

      data.position = position;
    }

    const statementBlock = await db
      .insertInto("Block")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
    return statementBlock;
  } catch (error) {
    console.log("Error while createing statement block", error);
    throw new Error("Error while createing statement block");
  }
}
