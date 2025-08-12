import { db } from "../../config/db";

export async function createStatementBlockService(data: any) {
  try {
    data.position = 100;
    data.updatedAt = new Date();

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
