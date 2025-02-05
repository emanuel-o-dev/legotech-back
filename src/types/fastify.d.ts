// src/types/fastify.d.ts

import { FastifyInstance } from "fastify";

// Extender os tipos do Fastify, por exemplo, adicionando um tipo customizado para o request
declare module "fastify" {
  export interface FastifyRequest {
    userId?: string; // Podemos adicionar uma propriedade "userId" ao request, por exemplo
  }

  export interface FastifyReply {
    customMessage: string; // Uma propriedade customizada no reply
  }
}
