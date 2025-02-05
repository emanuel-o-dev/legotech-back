import { redis } from "../db/redis"; // Importando a conexão com Redis

const CART_EXPIRATION = 60 * 60 * 24; // 24 horas

export class CartService {
  // Adicionar item ao carrinho
  static async addItem(userId: string, productId: string, quantity: number) {
    const cartKey = `cart:${userId}`;

    // Verifica se o item já existe no carrinho
    const existingQuantity = await redis.hget(cartKey, productId);

    const newQuantity = existingQuantity
      ? parseInt(existingQuantity) + quantity
      : quantity;

    // Adiciona ou atualiza a quantidade do item no carrinho
    await redis.hset(cartKey, productId, newQuantity.toString());

    // Define um TTL para o carrinho (24h)
    await redis.expire(cartKey, CART_EXPIRATION);
  }

  // Remover item do carrinho
  static async removeItem(userId: string, productId: string) {
    const cartKey = `cart:${userId}`;
    await redis.hdel(cartKey, productId);
  }

  // Obter itens do carrinho
  static async getCart(userId: string) {
    const cartKey = `cart:${userId}`;
    const cartItems = await redis.hgetall(cartKey);

    return Object.entries(cartItems).map(([productId, quantity]) => ({
      productId,
      quantity: Number(quantity).toFixed(0),
    }));
  }

  // Limpar carrinho
  static async clearCart(userId: string) {
    const cartKey = `cart:${userId}`;
    await redis.del(cartKey);
  }
}
