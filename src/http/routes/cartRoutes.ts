import { FastifyInstance } from "fastify";
import { authenticate } from "../middlewares/authMiddleware";
import { CartService } from "../../services/cartService";

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/cart/add",
    { preHandler: authenticate }, // Middleware de autenticação
    async (request, reply) => {
      const { productId, quantity } = request.body as {
        productId: number;
        quantity: number;
      };
      const userId = request.user.userId; // O usuário autenticado

      try {
        const cartService = new CartService();
        await cartService.addToCart(userId, productId, quantity);
        return reply
          .status(201)
          .send({ message: "Produto adicionado ao carrinho." });
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao adicionar produto ao carrinho." });
      }
    }
  );
}
