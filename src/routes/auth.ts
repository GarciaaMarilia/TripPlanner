import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { Login, Register } from "../authService";
import { ClientError, errorResponseSchema } from "../errors/client-error";

const userSchema = z.object({
 id: z.string().uuid(),
 email: z.string(),
 password: z.string(),
 name: z.string(),
});

const registerSchema = z.object({
 email: z.string(),
 password: z.string(),
 name: z.string(),
});

const loginSchema = z.object({
 email: z.string().email(),
 password: z.string(),
});

const loginResponseSchema = z.object({
 token: z
  .string()
  .regex(
   /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
   "Invalid JWT token format"
  ),
 user: userSchema,
});

const registerResponseSchema = z.object({ user: userSchema });

export async function authRoutes(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/register",
  {
   schema: {
    description: "Auth an user",
    tags: ["Authenticate"],
    body: registerSchema,
    response: {
     200: registerResponseSchema,
     401: errorResponseSchema,
    },
   },
  },
  async (request, reply) => {
   try {
    const { email, password, name } = request.body;

    const user = await Register(email, password, name);

    return {
     user: user,
    };
   } catch (error: unknown) {
    if (error instanceof ClientError) {
     reply.status(401).send({ error: error.message });
    }
   }
  }
 );

 app.withTypeProvider<ZodTypeProvider>().post(
  "/login",
  {
   schema: {
    description: "Login user",
    tags: ["Authenticate"],
    body: loginSchema,
    response: {
     200: loginResponseSchema,
     401: errorResponseSchema,
    },
   },
  },
  async (request, reply) => {
   try {
    const { email, password } = request.body;

    const response = await Login(email, password);

    return { token: response.token, user: response.user };
   } catch (error: unknown) {
    if (error instanceof ClientError) {
     reply.status(401).send({ error: error.message });
    }
   }
  }
 );
}
