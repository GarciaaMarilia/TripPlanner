import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import z from "zod";
import { Register } from "../authService";

export async function authRoutes(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/register",
  {
   schema: {
    body: z.object({
     email: z.string(),
     password: z.string(),
     name: z.string(),
    }),
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
}
