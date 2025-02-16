import { FastifyInstance } from "fastify";
import { CartService } from "../../services/cartService";
import { authenticate } from "../middlewares/authMiddleware";

export async function cartRoutes(fastify: FastifyInstance) {
  const cartService = new CartService();

  // Rota para adicionar produto ao carrinho
  fastify.post("/cart/add", { preHandler: authenticate }, async (request, reply) => {
    const { productId, quantity } = request.body as { productId: number; quantity: number };
    const userId = request.user.userId; // Usuário autenticado

    try {
      await cartService.addToCart(userId, productId, quantity);
      return reply.status(201).send({ message: "Produto adicionado ao carrinho." });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao adicionar produto ao carrinho." });
    }
  });

  fastify.get("/cart", { preHandler: authenticate }, async (request, reply) => {
  const userId = request.user.userId; // Usuário autenticado

  if (!userId) {
    return reply.status(400).send({ error: "Usuário não autenticado." });
  }

  try {
    const cartItems = await cartService.getCart(userId);
    return reply.status(200).send(cartItems); // Retorna os itens do carrinho
  } catch (error) {
    console.error("Erro ao recuperar carrinho:", error);
    return reply.status(500).send({ error: "Erro ao recuperar itens do carrinho." });
  }
});


  // Rota para remover um item do carrinho
  fastify.delete("/cart/remove/:productId", { preHandler: authenticate }, async (request, reply) => {
    const { productId } = request.params as { productId: number };
    const userId = request.user.userId; // Usuário autenticado

    try {
      await cartService.removeFromCart(userId, productId);
      return reply.status(200).send({ message: "Produto removido do carrinho." });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao remover produto do carrinho." });
    }
  });

  // Rota para limpar o carrinho
  fastify.delete("/cart/clear", { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.userId; // Usuário autenticado

    try {
      await cartService.clearCart(userId);
      return reply.status(200).send({ message: "Carrinho limpo." });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao limpar o carrinho." });
    }
  });
}
