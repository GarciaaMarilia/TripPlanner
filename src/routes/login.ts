import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { errorResponseSchema } from "../errors/client-error";
import { loginController } from "../controllers/login-controller";

const userSchema = z.object({
 id: z.string().uuid(),
 email: z.string(),
 password: z.string(),
 name: z.string(),
});

const registerBodySchema = z.object({
 email: z.string(),
 password: z.string(),
 name: z.string(),
});

const loginBodySchema = z.object({
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

export type RegisterBodySchema = z.infer<typeof registerBodySchema>;
export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export async function login(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/login",
  {
   schema: {
    description: "Login user",
    tags: ["Authenticate"],
    body: loginBodySchema,
    response: {
     200: loginResponseSchema,
     401: errorResponseSchema,
    },
   },
  },
  loginController
 );
}
