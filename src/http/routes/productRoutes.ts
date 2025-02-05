import { FastifyInstance } from "fastify";
import { getProducts, getProductById } from "../../services/productService"; // Importando o service

export async function productRoutes(app: FastifyInstance) {
  // Rota para buscar todos os produtos de forma resumida
  app.get("/products", async (request, reply) => {
    try {
      const products = await getProducts();
      return reply.send(products); // Retorna os produtos para o cliente
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar produtos" });
    }
  });

  // Rota para buscar produto específico por id com informações completas
  app.get("/products/info/:id", async (request, reply) => {
    const { id } = request.params as { id: number }; // Pegando o id dos parâmetros
    try {
      const product = await getProductById(id);
      return reply.send(product); // Retorna o produto encontrado
    } catch (error) {
      return reply.status(404).send({ error: "Produto não encontrado" });
    }
  });
}
