import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import { env } from "../env";
import { authenticate } from "./middlewares/authMiddleware";
import { productRoutes } from "./routes/productRoutes";
import { cartRoutes } from "./routes/cartRoutes";
import { purchaseRoutes } from "./routes/purchaseRoutes";
import { authRoutes } from "./routes/loginRoutes";
import { registerRoutes } from "./routes/registerUser";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
});

// Configurar JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET, // Pegando do .env
});

// Middleware de autenticação
app.decorate("authenticate", authenticate);

app.register(cartRoutes);
app.register(productRoutes);
app.register(purchaseRoutes);
app.register(authRoutes);
app.register(registerRoutes);

// Iniciar o servidor
const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 3333,
    });
    console.log(`🚀 Server running at http://localhost:${env.PORT}`);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

start();

export { app };
