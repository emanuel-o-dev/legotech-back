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
      name: "Lego Technic Car",
      description: "Advanced Lego Technic car model",
      price: "79.99",
      stock_quantity: 100,
      image_url: "https://m.media-amazon.com/images/I/81pWNcUBpGL.jpg",
    },
    {
      name: "Lego Star Wars Set",
      description: "Star Wars Lego set with characters and vehicles",
      price: "149.99",
      stock_quantity: 50,
      image_url: "https://m.media-amazon.com/images/I/814iDqQEBlL.jpg",
    },
    {
      name: "Lego City Police Station",
      description: "Police station building set",
      price: "59.99",
      stock_quantity: 75,
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xb6rkXO0uJSyntEKzY9pUlwklqDHvGOxQQ&s",
    },
    {
      name: "Lego Creator Expert",
      description: "Creator expert Lego set for advanced builders",
      price: "129.99",
      stock_quantity: 30,
      image_url:
        "https://http2.mlstatic.com/D_NQ_NP_997580-MLB75448119734_042024-O.webp",
    },
    {
      name: "Lego Friends Set",
      description: "Lego set for the Friends theme",
      price: "49.99",
      stock_quantity: 120,
      image_url:
        "https://www.anneclairebaby.com/cdn/shop/files/81Zw3uKoPwL._AC_SL1500.jpg?v=1706507963",
    },
  ]);

  // Inserir pedidos
  await db.insert(orders).values([
    { user_id: 1, total_amount: "899.99" },
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
