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
        itemId: order_items.id,
        orderId: order_items.order_id,
        productId: order_items.product_id,
        quantity: order_items.quantity,
        priceAtTime: order_items.price_at_time,
        productName: products.name,
        productDescription: products.description,
        productPrice: products.price,
        productStock: products.stock_quantity,
        productImage: products.image_url,
      })
      .from(orders)
      .leftJoin(order_items, eq(orders.id, order_items.order_id))
      .leftJoin(products, eq(order_items.product_id, products.id))
      .where(eq(orders.user_id, Number(userId)));

    if (userOrders.length === 0) {
      throw new Error("Nenhuma compra encontrada.");
    }

    // Agrupar os itens dentro de cada pedido
    const groupedOrders = userOrders.reduce((acc, row) => {
      const existingOrder = acc.find((order) => order.id === row.id);

      const item = {
        id: row.itemId,
        order_id: row.orderId,
        product_id: row.productId,
        quantity: row.quantity,
        price_at_time: row.priceAtTime,
        product: {
          id: row.productId,
          name: row.productName,
          description: row.productDescription,
          price: row.productPrice,
          stock_quantity: row.productStock,
          image_url: row.productImage,
        },
      };

      if (existingOrder) {
        existingOrder.items.push(item);
      } else {
        acc.push({
          id: row.id,
          totalAmount: row.totalAmount,
          createdAt: row.createdAt,
          items: [item],
        });
      }

      return acc;
    }, []);

    return groupedOrders;
  }
}
