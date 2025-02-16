import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../../services/authService";
import { UserService } from "../../services/userService";
import { z } from "zod"; // Importando o Zod

export async function authRoutes(app: FastifyInstance) {
  // Schema de validação para login
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  });

  // Schema de validação para signup
  const signupSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(4),
    address: z.string().min(5),
  });

  // Rota para login
  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      const authService = new AuthService(app);
      const result = await authService.login(email, password);

      if ("token" in result) {
        return reply.send({ token: result.token });
      } else {
        throw new Error("Erro ao realizar o login");
      }
    } catch (err: any) {
      console.error(err);
      return reply
        .status(400)
        .send({ message: err.message || "Erro ao realizar o login" });
    }
  });

  // Rota para cadastro (signup)
  app.post("/signup", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, password, address } = signupSchema.parse(request.body);

      const newUser = await UserService.registerUser(name, email, password, address, app);

      return reply.status(201).send(newUser);
    } catch (err: any) {
      console.error(err);
      return reply
        .status(400)
        .send({ message: err.message || "Erro ao realizar o cadastro" });
    }
  });
}
