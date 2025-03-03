import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";

import { ClientError } from "../errors/client-error";
import { RegisterBodySchema } from "../routes/register-user";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function registerUserController(
 request: FastifyRequest<{ Body: RegisterBodySchema }>,
 reply: FastifyReply
) {
 try {
  const { email, password, name } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
   data: {
    email,
    password: hashedPassword,
    name,
   },
  });
  return reply.status(200).send({ user });
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(401).send({ error: error.message });
  }
 }
}
