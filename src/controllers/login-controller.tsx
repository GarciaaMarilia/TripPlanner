import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { LoginBodySchema } from "../routes/register-user";
import { ClientError } from "../errors/client-error";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export async function loginController(
 request: FastifyRequest<{ Body: LoginBodySchema }>,
 reply: FastifyReply
) {
 try {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({
   where: { email },
  });

  if (!user) {
   throw new ClientError("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
   throw new ClientError("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, "your_jwt-secret", {
   expiresIn: "1h",
  });

  const { password: _, ...userWithoutPassword } = user;

  return reply.status(200).send({ token, user: userWithoutPassword });
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(401).send({ error: error.message });
  }
 }
}
