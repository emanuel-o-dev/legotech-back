import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserService } from "../../services/userService";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users/signin", handleUserSignIn);
  app.put("/users/:id", handleUserUpdate);
  app.delete("/users/:id", handleUserDelete);
  app.get("/user", { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const user = await UserService.getUserById(userId);

      if (!user) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }

      return reply.status(200).send(user); // Retorna todos os dados do usuário, incluindo a senha
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return reply.status(500).send({ error: "Erro ao buscar usuário" });
    }
  });
}


// Handler para criação de usuário (signin)
async function handleUserSignIn(request: FastifyRequest, reply: FastifyReply) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
    address: z.string(),
  });

  try {
    const { name, email, password, address } = userSchema.parse(request.body);
    const result = await UserService.registerUser(name, email, password, address);

    return reply.status(201).send(result);
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}

// Handler para atualização de usuário
async function handleUserUpdate(request: FastifyRequest, reply: FastifyReply) {
  const userUpdateSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(4).optional(),
    address: z.string().optional(),
  });

  try {
    const { id } = request.params as { id: string };
    const updates = userUpdateSchema.parse(request.body);
    const result = await UserService.updateUser(id, updates);

    return reply.send(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Handler para remoção de usuário
async function handleUserDelete(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const response = await UserService.deleteUserById(Number(id));

    return reply.status(200).send(response);
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}
