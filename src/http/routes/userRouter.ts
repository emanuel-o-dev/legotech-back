import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserService } from "../../services/userService";

export async function userRoutes(app: FastifyInstance) {
  app.post("/signin", async (request, reply) => {
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(4),
      address: z.string(),
    });

    const { name, email, password, address } = userSchema.parse(request.body);

    try {
      const result = await UserService.registerUser(
        name,
        email,
        password,
        address,
        app
      );
      return reply.status(201).send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
  app.put("/user/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number }; // Pegando o id dos parâmetros

    const userUpdateSchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(4).optional(),
      address: z.string().optional(),
    });

    try {
      const updates = userUpdateSchema.parse(request.body);
      const result = await UserService.updateUser(String(id), updates);
      return reply.send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
  app.delete("/users/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const response = await UserService.deleteUserById(Number(id));

      return reply.status(200).send(response);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}
