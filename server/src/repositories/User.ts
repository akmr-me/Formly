import { db } from "../config/db";

class UserRepository {
  async createUser(data: { email: string; passwordHash: string }) {
    return db
      .insertInto("User")
      .values({ ...data, updatedAt: new Date() })
      .returning(["id", "email", "createdAt", "updatedAt"])
      .executeTakeFirstOrThrow();
  }

  async getUserByEmail(email: string) {
    return db
      .selectFrom("User")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }

  async getUserById(id: string) {
    return db
      .selectFrom("User")
      .select(["id", "email", "createdAt", "updatedAt"])
      .where("id", "=", id)
      .executeTakeFirst();
  }
}

export default new UserRepository();
