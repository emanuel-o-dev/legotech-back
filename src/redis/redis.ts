import Redis from "ioredis";
import { envRedis } from "../env"; // Importando o env validado pelo Zod

export const redis = new Redis(envRedis.REDIS_URL, {
  tls: { rejectUnauthorized: false }, // Necessário para conexões seguras no Render
});

redis.on("connect", () => console.log("🔥 Conectado ao Redis!"));
redis.on("error", (err) => console.error("❌ Erro no Redis:", err));
