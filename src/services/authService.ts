import { FastifyInstance } from "fastify";
import { UserService } from "./userService";

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async login(email: string, password: string) {
    const userService = new UserService();
    const user = await userService.getUserByEmail(email);

    if (!user || user.id === null) {
      throw new Error("Usuário não encontrado ou id inválido");
    }

    // Verificando a senha diretamente
    if (user.password !== password) {
      throw new Error("Senha incorreta");
    }

    // Gerar o token JWT
    const token = this.app.jwt.sign({ userId: String(user.id) });

    return { token };
  }
}
