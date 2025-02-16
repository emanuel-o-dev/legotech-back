import { FastifyInstance } from "fastify";
import { authenticate } from "../middlewares/authMiddleware";
import { CartService } from "../../services/cartService";

export async function cartRoutes(fastify: FastifyInstance) {
  const cartService = new CartService();

  // Rota para adicionar produto ao carrinho
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

  // Rota para obter os itens do carrinho
  fastify.get(
    "/cart/:userId",
    { preHandler: authenticate }, // Middleware de autenticação
    async (request, reply) => {
      const { userId } = request.params as { userId: string };

      try {
        const cartItems = await cartService.getCart(userId);
        return reply.status(200).send(cartItems);
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao recuperar itens do carrinho." });
      }
    }
  );

  // Rota para remover um item do carrinho
  fastify.delete(
    "/cart/remove/:userId/:productId",
    { preHandler: authenticate }, // Middleware de autenticação
    async (request, reply) => {
      const { userId, productId } = request.params as { userId: string; productId: number };

      try {
        await cartService.removeFromCart(userId, productId);
        return reply
          .status(200)
          .send({ message: "Produto removido do carrinho." });
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao remover produto do carrinho." });
      }
    }
  );

  // Rota para limpar o carrinho
  fastify.delete(
    "/cart/clear/:userId",
    { preHandler: authenticate }, // Middleware de autenticação
    async (request, reply) => {
      const { userId } = request.params as { userId: string };

      try {
        await cartService.clearCart(userId);
        return reply.status(200).send({ message: "Carrinho limpo." });
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao limpar o carrinho." });
      }
    }
  );

}
