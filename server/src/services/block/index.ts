import fs from "node:fs";
import path from "node:path";
import ApiError from "../../utils/ApiError";
import { MinimumBlockInForm } from "../../constants";
import formRepository from "../../repositories/Form";
import blockRepository from "../../repositories/Block";

export async function getBlockByIdService(id: string) {
  const block = await blockRepository.getBlockById(id);
  if (!block) {
    throw new ApiError(404, `Block with ID ${id} not found`);
  }
  return block;
}

export async function updateBlockFieldService(id: string, data: any) {
  const block = await blockRepository.updateBlockById(id, data);
  if (!block) {
    throw new ApiError(404, `Block with ID ${id} not found`);
  }
  return block;
}

export async function deleteBlockService(id: string) {
  const result = await blockRepository.countBlocksInFormByBlockId(id);
  if ((result?.blockCount || 0) <= MinimumBlockInForm) {
    throw new ApiError(
      400,
      `Form must have at least ${MinimumBlockInForm} blocks`
    );
  }
  await blockRepository.deleteBlockById(id);
}

export async function deleteBlockFileService(id: string) {
  const block = await blockRepository.getBlockFileById(id);
  if (!block) {
    throw new ApiError(404, `Block with ID ${id} not found`);
  }

  if (block.coverImagePath) {
    const filePath = block.coverImagePath.replace("/", "\\");
    const fullPath = path.join("public", filePath);
    fs.unlinkSync(fullPath);

    const newBlock = await blockRepository.deleteBlockFileById(id);
    return newBlock;
  }
}

export async function duplicateBlockService(id: string) {
  const currentAndAdjacentBlocks =
    await formRepository.getCurrentAndAdjacentBlocks(id);

  const currentBlock = currentAndAdjacentBlocks.find(
    (block) => block.id === id
  );
  const nextBlock = currentAndAdjacentBlocks.find((block) => block.id !== id);

  if (!currentBlock) throw new ApiError(404, "Block not found");

  let newBlockPosition;
  if (!nextBlock) {
    newBlockPosition = currentBlock.position + 100;
  } else {
    newBlockPosition = (nextBlock.position + currentBlock.position) / 2;
  }

  const {
    id: _,
    updatedAt: __,
    createdAt: ___,
    ...newBlockData
  } = currentBlock;

  const newBlock = await blockRepository.insertBlock({
    ...newBlockData,
    position: newBlockPosition,
    updatedAt: new Date(),
  });

  return newBlock;
}
