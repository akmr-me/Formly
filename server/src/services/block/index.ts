import { db } from "../../config/db";

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
