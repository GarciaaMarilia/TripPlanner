import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { errorResponseSchema } from "../errors/client-error";
import { registerUserController } from "../controllers/register-user-controller";

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

const registerResponseSchema = z.object({ user: userSchema });

export type RegisterBodySchema = z.infer<typeof registerBodySchema>;
export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export async function registerUser(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/register",
  {
   schema: {
    description: "Auth an user",
    tags: ["Authenticate"],
    body: registerBodySchema,
    response: {
     200: registerResponseSchema,
     401: errorResponseSchema,
    },
   },
  },
  registerUserController
 );
}
