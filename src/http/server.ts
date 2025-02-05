import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { getPendingGoalsRoute } from "./routes/get-pending-goals";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import { cartRoutes } from "./routes/cartRoutes";

import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import { env } from "../env";
import { authenticate } from "./middlewares/authMiddleware";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configurar JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET, // Pegando do .env
});

// Middleware de autenticação
app.decorate("authenticate", authenticate);
app.register(createGoalRoute);
app.register(createCompletionRoute);
app.register(getPendingGoalsRoute);
app.register(getWeekSummaryRoute);

app.register(cartRoutes);

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
