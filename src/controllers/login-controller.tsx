import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { LoginBodySchema } from "../routes/register-user";
import { ClientError } from "../errors/client-error";

const envFile =
 process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;

export async function loginController(
 request: FastifyRequest<{ Body: LoginBodySchema }>,
 reply: FastifyReply
) {
 try {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({
   where: { email },
  });

  if (!JWT_SECRET) {
   throw new ClientError("JWT_SECRET is not defined in environment variables");
  }

  if (!user) {
   throw new ClientError("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
   throw new ClientError("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
   expiresIn: "1h",
  });

  const { password: _, email: __, ...userWithoutPasswordAndEmail } = user;

  return reply.status(200).send({ token, user: userWithoutPasswordAndEmail });
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(401).send({ error: error.message });
  }
 }
}
