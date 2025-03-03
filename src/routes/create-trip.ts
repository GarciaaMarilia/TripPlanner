import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { createTripController } from "../controllers/create-trip-controller";

export const createTripSchema = z.object({
 id_user: z.string(),
 destination: z.string().min(4),
 starts_at: z.coerce.date(),
 ends_at: z.coerce.date().optional(),
 owner_name: z.string(),
 owner_email: z.string().email(),
 emails_to_invite: z.array(z.string().email()),
});

export const headersSchema = z.object({
 authorization: z
  .string()
  .regex(/^Bearer\s[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/, {
   message: "Invalid Bearer token format",
  }),
});

export type CreateTripSchema = z.infer<typeof createTripSchema>;

export async function createTrip(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips",
  {
   schema: {
    description: "Create a trip",
    tags: ["Trips"],
    body: createTripSchema,
    headers: headersSchema,
   },
  },
  createTripController
 );
}
