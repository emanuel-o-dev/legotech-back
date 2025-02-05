// src/types/jwt.d.ts

import { FastifyInstance } from "fastify";
import { JwtOptions } from "@fastify/jwt";

// Extensão de tipos do Fastify com o JWT
declare module "fastify" {
  interface FastifyInstance {
    jwt: {
      sign: (payload: object, options?: JwtOptions) => string;
      verify: (token: string) => object;
    };
  }

  // Caso precise definir o payload do JWT
  export interface FastifyJWT {
    userId: string; // Define a estrutura do payload do JWT
  }
}
