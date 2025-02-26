import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { deteleTripController } from "../controllers/delete-trip-controller";

const deleteTripParamsSchema = z.object({
 tripId: z.string().uuid(),
});

export type DeleteTripParamsSchema = z.infer<typeof deleteTripParamsSchema>;

export async function deleteTrip(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId",
  {
   schema: {
    description: "Delete a trip",
    tags: ["Trips"],
    params: deleteTripParamsSchema,
    response: {
     200: z.string(),
     404: z.string(),
    },
   },
  },
  deteleTripController
 );
}
