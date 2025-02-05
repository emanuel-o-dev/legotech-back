import { eq } from "drizzle-orm";
import { db } from "../db"; // sua instância do Drizzle
import { products } from "../db/schema";

// Função para buscar todos os produtos de forma resumida
export const getProducts = async () => {
  try {
    const result = await db.select().from(products);
    return result;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Erro ao buscar produtos");
  }
};

// Função para buscar produto por id (detalhes completos)
export const getProductById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new Error("Produto não encontrado");
    }
    return result[0];
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
};
