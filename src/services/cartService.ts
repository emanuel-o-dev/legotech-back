import { sql, inArray } from "drizzle-orm";
import { db } from "../db";
import { redis } from "../db/redis";
import { order_items, orders, products } from "../db/schema";

export class CartService {
  private cartKey(userId: string) {
    return `cart:${userId}`;
  }

  async getCart(userId: string) {
    const cartKey = this.cartKey(userId);

    try {
      const items = await redis.hgetall(cartKey);
      if (!items || Object.keys(items).length === 0) return [];

      const productIds = Object.values(items).map((item) =>
        JSON.parse(String(item)).productId
      );

      if (productIds.length === 0) return [];

      const productDetails = await db
        .select({
          productId: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          imageUrl: products.image_url,
        })
        .from(products)
        .where(inArray(products.id, productIds))
        .execute();

      const cartItemsWithDetails = Object.values(items).map((item) => {
        const cartItem = JSON.parse(String(item));
        const product = productDetails.find(
          (prod) => prod.productId === cartItem.productId
        );
        return { ...cartItem, ...product };
      });

      return cartItemsWithDetails;
    } catch (error) {
      console.error("Erro ao recuperar carrinho:", error);
      throw new Error("Erro interno ao recuperar o carrinho.");
    }
  }

  async finalizePurchase(userId: string): Promise<string> {
    const cartKey = `cart:${userId}`;

    try {
      const cartItems = await this.getCart(userId);

      if (cartItems.length === 0) {
        throw new Error("Carrinho vazio!");
      }

      const productIds = cartItems.map((item) => item.productId);

      const productDetails = await db
        .select({
          productId: products.id,
          price: products.price,
        })
        .from(products)
        .where(inArray(products.id, productIds))
        .execute();

      let totalAmount = cartItems.reduce((total, item) => {
        const product = productDetails.find(
          (prod) => prod.productId === item.productId
        );
        return product ? total + Number(product.price) * item.quantity : total;
      }, 0);

      const [order] = await db
        .insert(orders)
        .values({
          user_id: Number(userId),
          total_amount: totalAmount,
          created_at: new Date(),
        })
        .returning({ id: orders.id });

      await db.insert(order_items).values(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price_at_time:
            productDetails.find((prod) => prod.productId === item.productId)
              ?.price || 0,
        }))
      );

      await redis.del(cartKey);

      return order.id.toString();
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      throw new Error("Erro interno ao finalizar a compra.");
    }
  }
}
