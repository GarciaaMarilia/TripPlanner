import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { Login, Register } from "../authService";
import { FastifyTypedInstance } from "../types";

const registerSchema = z.object({
 email: z.string(),
 password: z.string(),
 name: z.string(),
});

const loginSchema = z.object({
 email: z.string().email(),
 password: z.string(),
});

export async function authRoutes(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/register",
  {
   schema: {
    tags: ["Authenticate"],
    body: registerSchema,
   },
  },
  async (request) => {
   const { email, password, name } = request.body;

   const user = await Register(email, password, name);

   return {
    user: user,
   };
  }
 );

 app.withTypeProvider<ZodTypeProvider>().post(
  "/login",
  {
   schema: {
    description: "Login user",
    tags: ["Authenticate"],
    body: loginSchema,
   },
  },
  async (request, reply) => {
   try {
    const { email, password } = request.body;

    const response = await Login(email, password);

    return { token: response.token, user: response.user };
   } catch (error: any) {
    reply.status(401).send({ error: error.message });
   }
  }
 );
}
