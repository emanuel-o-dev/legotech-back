import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  timestamp,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

// Definindo a tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: text("email").unique(),
  password: text("password"),
  address: text("address"),
});

// Definindo a tabela de produtos

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock_quantity: integer("stock_quantity").notNull(),
  image_url: varchar("image_url", { length: 255 }), // Novo campo para a URL da imagem
});

// Definindo a tabela de pedidos
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id), // Chave estrangeira
  total_amount: numeric("total_amount"), // Total do pedido
  created_at: timestamp("created_at").defaultNow(), // Data do pedido
});

// Definindo a tabela de itens do pedido
export const order_items = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id")
    .notNull()
    .references(() => orders.id), // Chave estrangeira
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id), // Chave estrangeira
  quantity: numeric("quantity"), // Quantidade do produto
  price_at_time: numeric("price_at_time"), // Preço no momento do pedido
});
