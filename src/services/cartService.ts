import { sql } from "drizzle-orm";
import { db } from "../db";
import { redis } from "../db/redis";
import { inArray } from 'drizzle-orm';
import { order_items, orders, products } from "../db/schema";

export class CartService {
  private cartKey(userId: string) {
    return `cart:${userId}`;
  }

  async addToCart(userId: string, productId: number, quantity: number) {
    const cartKey = this.cartKey(userId);

    try {
      const existingProduct = await redis.hget(cartKey, String(productId));

      if (existingProduct) {
        const updatedQuantity = JSON.parse(existingProduct).quantity + quantity;
        await redis.hset(
          cartKey,
          String(productId),
          JSON.stringify({ productId, quantity: updatedQuantity })
        );
      } else {
        await redis.hset(
          cartKey,
          String(productId),
          JSON.stringify({ productId, quantity })
        );
      }

      // Define um tempo de expiração para o carrinho (ex: 24 horas)
      await redis.expire(cartKey, 86400 * 7); //7 dias
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      throw new Error("Erro interno ao manipular o carrinho.");
    }
  }

  async getCart(userId: string) {
  const cartKey = this.cartKey(userId);

  try {
    const items = await redis.hgetall(cartKey);
    if (!items || Object.keys(items).length === 0) return [];

    const productIds = Object.values(items).map((item) =>
      JSON.parse(String(item)).productId
    );

    // Verifica se existem IDs de produtos
    if (productIds.length === 0) return [];

    // Busque os dados completos dos produtos

    const productDetails = await db
      .select({
        productId: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.image_url,
      })
      .from(products)
      .where(inArray(products.id, productIds)) // 🚀 Correção aqui
      .execute();




    // Adiciona os detalhes do produto aos itens do carrinho
    const cartItemsWithDetails = Object.values(items).map((item) => {
      const cartItem = JSON.parse(String(item));
      const product = productDetails.find(
        (prod) => prod.productId === cartItem.productId
      );
      return { ...cartItem, ...product }; // Junta os dados do produto no carrinho
    });

    return cartItemsWithDetails;
  } catch (error) {
    console.error("Erro ao recuperar carrinho:", error);
    throw new Error("Erro interno ao recuperar o carrinho.");
  }
}


  async removeFromCart(userId: string, productId: number) {
    const cartKey = this.cartKey(userId);

    try {
      await redis.hdel(cartKey, String(productId));
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw new Error("Erro interno ao remover item do carrinho.");
    }
  }

  async clearCart(userId: string) {
    const cartKey = this.cartKey(userId);

    try {
      await redis.del(cartKey);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw new Error("Erro interno ao limpar o carrinho.");
    }
  }

  async finalizePurchase(userId: string): Promise<string> {
    const cartKey = `cart:${userId}`;

    try {
      // 1. Recupera os itens do carrinho
      const cartItems = await this.getCart(userId);

      if (cartItems.length === 0) {
        throw new Error("Carrinho vazio!");
      }

      // 2. Calcular o total do pedido
      const productDetails = await db
        .select({
          productId: products.id,
          price: products.price,
          quantity: sql`jsonb_extract_path_text(${cartItems}, 'quantity')`.as(
            "quantity"
          ),
        })
        .from(products)
        .where(
          sql`${products.id} IN (${cartItems
            .map((item) => item.productId)
            .join(",")})`
        )
        .execute();

      let totalAmount = 0;
      for (const item of productDetails) {
        const product = cartItems.find(
          (cartItem) => cartItem.productId === item.productId
        );
        if (product) {
          totalAmount += Number(item.price) * Number(item.quantity);
        }
      }

      // 3. Criação do pedido no banco de dados
      const [order] = await db
        .insert(orders)
        .values({
          user_id: Number(userId),
          total_amount: totalAmount.toString(),
          created_at: new Date(),
        })
        .returning();

      // 4. Criação dos itens do pedido
      await Promise.all(
        cartItems.map(async (item) => {
          const product = productDetails.find(
            (prod) => prod.productId === item.productId
          );
          if (product) {
            await db.insert(order_items).values({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price_at_time: product.price,
            });
          }
        })
      );

      // 5. Limpar o carrinho
      await redis.del(cartKey);

      return order.id.toString(); // Retornar o ID do pedido criado
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      throw new Error("Erro interno ao finalizar a compra.");
    }
  }

  // Atualizar o status de pagamento
  async updatePaymentStatus(
    orderId: number,
    paymentStatus: string
  ): Promise<{ success: boolean }> {
    try {
      // Sua lógica para atualizar o pagamento no banco de dados
      return { success: true };
    } catch (error) {
      throw new Error("Erro ao atualizar o status do pagamento.");
    }
  }
}
