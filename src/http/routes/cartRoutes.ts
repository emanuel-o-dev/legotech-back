import { FastifyInstance } from "fastify";
import { CartService } from "../../services/cartService";
import { authenticate } from "../middlewares/authMiddleware";

export async function cartRoutes(fastify: FastifyInstance) {
  const cartService = new CartService();

  // Adicionar produto ao carrinho
  fastify.post("/cart/add", { preHandler: authenticate }, async (request, reply) => {
    const { productId, quantity } = request.body as { productId: number; quantity: number };
    const userId = request.user.userId;

    try {
      await cartService.addToCart(userId, productId, quantity);
      return reply.status(201).send({ message: "Produto adicionado ao carrinho." });
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      return reply.status(500).send({ error: "Erro ao adicionar produto ao carrinho." });
    }
  });
  
  fastify.get("/cart/quantity", { preHandler: authenticate }, async (request, reply) => {
  const userId = request.user.userId;

  try {
    const quantity = await cartService.getCartQuantity(userId);
    return reply.status(200).send({ quantity });
  } catch (error) {
    console.error("Erro ao recuperar quantidade de itens no carrinho:", error);
    return reply.status(500).send({ error: "Erro ao recuperar quantidade de itens no carrinho." });
  }
});
  // Atualizar a quantidade de um item no carrinho
  fastify.put("/cart/update", { preHandler: authenticate }, async (request, reply) => {
    const { productId, quantity } = request.body as { productId: number; quantity: number };
    const userId = request.user.userId;

    try {
      await cartService.updateCartItemQuantity(userId, productId, quantity);
      return reply.status(200).send({ message: "Quantidade do produto atualizada." });
    } catch (error) {
      console.error("Erro ao atualizar quantidade do produto:", error);
      return reply.status(500).send({ error: "Erro ao atualizar quantidade do produto." });
    }
  });

  // Obter itens do carrinho
  fastify.get("/cart", { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.userId;

    try {
      const cartItems = await cartService.getCart(userId);
      return reply.status(200).send(cartItems);
    } catch (error) {
      console.error("Erro ao recuperar carrinho:", error);
      return reply.status(500).send({ error: "Erro ao recuperar itens do carrinho." });
    }
  });

  // Remover um item do carrinho
  fastify.delete("/cart/remove/:productId", { preHandler: authenticate }, async (request, reply) => {
    const { productId } = request.params as { productId: number };
    const userId = request.user.userId;

    try {
      await cartService.removeFromCart(userId, productId);
      return reply.status(200).send({ message: "Produto removido do carrinho." });
    } catch (error) {
      console.error("Erro ao remover produto do carrinho:", error);
      return reply.status(500).send({ error: "Erro ao remover produto do carrinho." });
    }
  });

  // Limpar carrinho
  fastify.delete("/cart/clear", { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.userId;

    try {
      await cartService.clearCart(userId);
      return reply.status(200).send({ message: "Carrinho limpo." });
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      return reply.status(500).send({ error: "Erro ao limpar o carrinho." });
    }
  });

  // Finalizar compra
  fastify.post("/cart/checkout", { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.userId;

    try {
      const orderId = await cartService.finalizePurchase(userId);
      return reply.status(200).send({ message: "Compra finalizada com sucesso.", orderId });
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      return reply.status(500).send({ error: "Erro ao finalizar a compra." });
    }
  });
}
