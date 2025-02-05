import { FastifyInstance } from "fastify";
import { authenticate } from "../middlewares/authMiddleware"; // Importando o middleware
import { CartService } from "../../services/cart";

export async function cartRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authenticate); // Aplica o middleware em todas as rotas abaixo

  app.post("/cart/add", async (request, reply) => {
    const { productId, quantity } = request.body as {
      productId: string;
      quantity: number;
    };
    const userId = (request.user as any).userId;

    await CartService.addItem(userId, productId, quantity);
    return reply.send({ message: "Item adicionado ao carrinho." });
  });

  app.get("/cart", async (request, reply) => {
    const userId = (request.user as any).userId;
    const cart = await CartService.getCart(userId);
    return reply.send(cart);
  });
}
