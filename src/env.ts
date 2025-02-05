import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

import dotenv from "dotenv";

dotenv.config();

const envSchemaRedis = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
});

export const envRedis = envSchemaRedis.parse(process.env);
