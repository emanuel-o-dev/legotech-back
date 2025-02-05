import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { UserService } from "./userService";

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async login(email: string, password: string) {
    const userService = new UserService();
    const user = await userService.getUserByEmail(email);

    if (!user || user.id === null) {
      throw new Error("Usuário não encontrado ou id inválido");
    }

    const passwordMatch = await bcrypt.compare(password, String(user.password));
    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    // Garantindo que user.id seja tratado como string, caso contrário gera um erro.
    const token = this.app.jwt.sign({ userId: String(user.id) });

    return { token };
  }
}
