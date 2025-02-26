import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { getTripsController } from "../controllers/get-trips-controllers";

const getTripsSchema = z.object({
 userId: z.string(),
});

const tripsResponseSchema = z.array(
 z.object({
  id: z.string(),
  id_user: z.string(),
  destination: z.string(),
  starts_at: z.date(),
  ends_at: z.date().nullable(),
  is_confirmed: z.boolean(),
  created_at: z.date(),
 })
);

export type GetTripsSchema = z.infer<typeof getTripsSchema>;

export async function getTrips(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/listTrips/:userId",
  {
   schema: {
    description: "List all trips for user",
    tags: ["Trips"],
    params: getTripsSchema,
    response: {
     200: tripsResponseSchema,
     400: z.object({ error: z.string() }),
     404: z.object({ error: z.string() }),
    },
   },
  },
  getTripsController
 );
}
