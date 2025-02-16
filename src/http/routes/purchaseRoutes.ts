// src/routes/purchaseRoutes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authenticate } from "../middlewares/authMiddleware"; // Importe o middleware de autenticação
import { CartService } from "../../services/cartService";
import { OrderService } from "../../services/orderService";
interface FinalizePurchaseParams {
  userId: string;
}

interface ConfirmPaymentParams {
  orderId: string;
}

interface ConfirmPaymentBody {
  paymentStatus: string;
}

export async function purchaseRoutes(fastify: FastifyInstance) {
  const cartService = new CartService();
  
  fastify.get("/purchases", { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const purchases = await OrderService.getUserOrders(userId);
      return reply.send(purchases);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
  // Rota para finalizar a compra, não precisa de autenticação
  fastify.post<{ Params: FinalizePurchaseParams }>(
    "/purchase/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.params;

      try {
        const orderId = await cartService.finalizePurchase(userId);
        reply.send({ orderId });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(500).send({ error: error.message });
        } else {
          reply
            .status(500)
            .send({ error: "Erro desconhecido ao finalizar a compra." });
        }
      }
    }
  );

  // Rota para confirmar o pagamento, com autenticação
  fastify.post<{ Params: ConfirmPaymentParams; Body: ConfirmPaymentBody }>(
    "/purchase/confirm-payment/:orderId",
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { orderId } = request.params;
      const { paymentStatus } = request.body;

      try {
        const result = await cartService.updatePaymentStatus(
          Number(orderId),
          paymentStatus
        );
        reply.send(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(500).send({ error: error.message });
        } else {
          reply
            .status(500)
            .send({ error: "Erro desconhecido ao confirmar o pagamento." });
        }
      }
    }
  );
}
