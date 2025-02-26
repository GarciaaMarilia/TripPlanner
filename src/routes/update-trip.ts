import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { updateTripController } from "../controllers/update-trip-controller";

const updateTripParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const updateTripBodySchema = z.object({
 destination: z.string().min(4),
 starts_at: z.coerce.date(),
 ends_at: z.coerce.date(),
});

const updateTripResponseSchema = z.object({
 tripId: z.string(),
});

export type UpdateTripParamsSchema = z.infer<typeof updateTripParamsSchema>;
export type UpdateTripBodySchema = z.infer<typeof updateTripBodySchema>;

export async function updateTrip(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().put(
  "/trips/:tripId",
  {
   schema: {
    description: "Update a trip",
    tags: ["Trips"],
    params: updateTripParamsSchema,
    body: updateTripBodySchema,
    response: {
     200: updateTripResponseSchema,
    },
   },
  },
  updateTripController
 );
}
