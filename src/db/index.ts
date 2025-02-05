import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, products, orders, order_items } from "./schema";

import dotenv from "dotenv";
import z from "zod";

// Carregar as variáveis do .env
dotenv.config();

// Validando as variáveis de ambiente
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

// Configurando o cliente com SSL
const client = postgres(env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // Habilitando SSL
});

export const db = drizzle(client, {
  schema: { users, products, orders, order_items },
});
