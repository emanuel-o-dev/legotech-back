import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../services/userService";
import { z } from "zod";

// Schema para validar os dados do usuário com Zod
const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().min(3),
  address: z.string().min(5),
});

export async function registerRoutes(app: FastifyInstance) {
  // Rota para cadastro de novo usuário
  app.post("/signin", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validação dos dados fornecidos na requisição
      const { email, password, name, address } = registerUserSchema.parse(
        request.body
      );

      const userService = new UserService();
      const newUser = await userService.registerUser(
        email,
        password,
        name,
        address
      );

      // Retorna a resposta com a confirmação e dados do novo usuário
      return reply.send({
        message: "Cadastro realizado com sucesso!",
        user: newUser,
      });
    } catch (err: any) {
      return reply
        .status(400)
        .send({ message: err.message || "Erro ao cadastrar o usuário" });
    }
  });
}
