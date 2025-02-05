import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export class UserService {
  async getUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user.length > 0 ? user[0] : null;
  }
}
