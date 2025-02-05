import z from "zod";
import dotenv from "dotenv";

dotenv.config();
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string(),
  PORT: z.string(),
});
export const env = envSchema.parse(process.env);
