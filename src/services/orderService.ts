import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders, order_items, products } from "../db/schema";

export class OrderService {
  static async getUserOrders(userId: string) {
    const userOrders = await db
      .select({
        id: orders.id,
        totalAmount: orders.total_amount,
        createdAt: orders.created_at,
        items: order_items,
        product: products,
      })
      .from(orders)
      .leftJoin(order_items, eq(orders.id, order_items.order_id))
      .leftJoin(products, eq(order_items.product_id, products.id))
      .where(eq(orders.user_id, Number(userId)));

    if (userOrders.length === 0) {
      throw new Error("Nenhuma compra encontrada.");
    }

    return userOrders;
  }
}
