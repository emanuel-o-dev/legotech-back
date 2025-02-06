import { db } from "."; // Importando a conexão com o banco

const cleanDatabase = async () => {
  await db.execute("DROP SCHEMA IF EXISTS drizzle CASCADE;");
  await db.execute(
    "DROP TABLE IF EXISTS users, products, orders, order_items CASCADE;"
  );

  console.log("Banco de dados limpo com sucesso!");
};

cleanDatabase().catch((err) => {
  console.error("Erro ao limpar o banco de dados:", err);
});
