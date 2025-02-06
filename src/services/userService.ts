import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export class UserService {
  async getUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user.length > 0 ? user[0] : null;
  }

  async registerUser(
    email: string,
    password: string,
    name: string,
    address: string
  ) {
    // Verifica se o usuário com o e-mail fornecido já existe
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (userExists.length > 0) {
      throw new Error("Usuário com esse e-mail já existe.");
    }

    // Insere o novo usuário no banco de dados
    const newUser = await db
      .insert(users)
      .values({
        email,
        password,
        name,
        address,
      })
      .returning();

    return newUser[0];
  }
}
