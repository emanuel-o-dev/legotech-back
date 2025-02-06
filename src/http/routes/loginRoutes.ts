import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../../services/authService";
import { z } from "zod"; // Importando o Zod

export async function authRoutes(app: FastifyInstance) {
  // Definindo o schema de validação com Zod
  const loginSchema = z.object({
    email: z.string().email(), // Validando que o email seja válido
    password: z.string().min(4), // Validando que a senha tenha no mínimo 6 caracteres
  });

  // Rota para login
  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      const authService = new AuthService(app);
      const result = await authService.login(email, password);

      console.log(result);
      // Verifique se o resultado contém a propriedade token
      if ("token" in result) {
        return reply.send({ token: result.token });
      } else {
        throw new Error("Erro ao realizar o login");
      }
    } catch (err: any) {
      console.error(err); // Para depuração
      return reply
        .status(400)
        .send({ message: err.message || "Erro ao realizar o login" });
    }
  });
}
