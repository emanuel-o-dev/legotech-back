import { z } from "zod";

// Definindo o esquema Zod para o carrinho de compras
export const cartItemSchema = z.object({
  productId: z.number().int(), // Supondo que o productId seja um número inteiro
  quantity: z.number().int().positive(), // A quantidade deve ser um número positivo
});

export type CartItem = z.infer<typeof cartItemSchema>;
