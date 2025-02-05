import { drizzle } from "drizzle-orm/postgres-js"; // Importe corretamente o drizzle
import postgres from "postgres"; // Importe o cliente postgres
import { users, products, orders, order_items } from "./schema"; // Importe seu schema

import dotenv from "dotenv"; // Para carregar as variáveis de ambiente
import z from "zod"; // Para validar as variáveis de ambiente

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Validar as variáveis de ambiente
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

// Configuração do cliente com SSL para conectar ao PostgreSQL
const client = postgres(env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // SSL já configurado na URL
});

// Configuração do Drizzle ORM com o cliente
export const db = drizzle(client, {
  schema: { users, products, orders, order_items }, // Passar o schema aqui
});
