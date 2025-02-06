import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export class UserService {
  async getUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user.length > 0 ? user[0] : null;
  }
  static async registerUser(
    name: string,
    email: string,
    password: string,
    address: string,
    app: any
  ) {
    // Verificar se o email já está cadastrado
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      throw new Error("Email já está em uso.");
    }

    // Criar usuário
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password, // Sem hash por enquanto
        address,
      })
      .returning();

    // Gerar token JWT
    const token = app.jwt.sign({ id: newUser.id, email: newUser.email });

    return { user: newUser, token };
  }

  static async updateUser(
    userId: string,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      address?: string;
    }
  ) {
    // Verificar se o usuário existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    // Atualizar os dados do usuário
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, Number(userId)))
      .returning();

    return updatedUser;
  }

  static async deleteUserById(id: number) {
    // Verifica se o usuário existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error("Usuário não encontrado.");
    }

    // Deleta o usuário
    await db.delete(users).where(eq(users.id, id));

    return { message: "Usuário deletado com sucesso." };
  }
}
