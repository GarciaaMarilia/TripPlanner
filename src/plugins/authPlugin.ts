import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ClientError } from "../errors/client-error";
import { UserSchema } from "../routes/login";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module "fastify" {
 interface FastifyInstance {
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
 }
 interface FastifyRequest {
  user?: UserSchema;
 }
}

async function authPlugin(fastify: FastifyInstance) {
 fastify.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
   try {
    if (!JWT_SECRET) {
     throw new ClientError(
      "JWT_SECRET is not defined in environment variables"
     );
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
     return reply.code(401).send({ error: "Token ausente" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
     return reply.code(401).send({ error: "Formato de token inválido" });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET) as UserSchema; // Atribuindo o tipo UserSchema ao decoded
    request.user = decoded;
   } catch (err) {
    reply.code(401).send({ error: "Token inválido ou expirado" });
   }
  }
 );
}

export default fp(authPlugin);
