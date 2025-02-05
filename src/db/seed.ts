import { db } from "."; // Conexão com o banco de dados
import { users, products, orders, order_items } from "./schema"; // Importando as tabelas

const seedDatabase = async () => {
  // Inserir usuários
  await db.insert(users).values([
    {
      name: "Lucas Silva",
      email: "lucas@legotech.com",
      password: "1234",
      address: "Rua Exemplo, 123",
    },
    {
      name: "Maria Oliveira",
      email: "maria@legotech.com",
      password: "abcd",
      address: "Av. Imagem, 456",
    },
  ]);

  // Inserir produtos
  await db.insert(products).values([
    {
      name: "Lego Star Wars Millennium Falcon",
      description: "Construa o icônico Millennium Falcon.",
      price: "899.99", // Convertendo o preço para string
      stock_quantity: "10", // Convertendo a quantidade para string
    },
    {
      name: "Lego Technic Bugatti Chiron",
      description: "Modelo detalhado do supercarro Bugatti Chiron.",
      price: "699.99",
      stock_quantity: "5",
    },
    {
      name: "Lego Ninjago Destiny's Bounty",
      description: "Embarque em aventuras com a Destiny's Bounty.",
      price: "499.99",
      stock_quantity: "7",
    },
  ]);

  // Inserir pedidos
  await db.insert(orders).values([
    { user_id: 1, total_amount: "899.99" }, // Total como string
    { user_id: 2, total_amount: "1199.98" },
  ]);

  // Inserir itens de pedidos
  await db.insert(order_items).values([
    { order_id: 1, product_id: 1, quantity: "1", price_at_time: "899.99" }, // Quantidade e preço como string
    { order_id: 2, product_id: 1, quantity: "1", price_at_time: "899.99" },
    { order_id: 2, product_id: 2, quantity: "1", price_at_time: "699.99" },
  ]);
};

// Rodar a seed
seedDatabase()
  .then(() => {
    console.log("Banco de dados populado com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao popular o banco de dados:", err);
  });
