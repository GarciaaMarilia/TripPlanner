import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { getTripDetailsController } from "../controllers/get-trip-details-controller";

const getTripDetailsSchema = z.object({
 tripId: z.string().uuid(),
});

export type GetTripDetailsSchema = z.infer<typeof getTripDetailsSchema>;

export async function getTripDetails(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId",
  {
   schema: {
    tags: ["Trips"],
    params: getTripDetailsSchema,
   },
  },
  getTripDetailsController
 );
}
