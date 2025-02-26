import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { createTripSchema } from "./create-trip";
import { ClientError } from "../errors/client-error";

const getTripsSchema = z.object({
 userId: z.string(),
});

const tripsResponseSchema = z.array(createTripSchema);

export async function getTrips(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/listTrips/:userId",
  {
   schema: {
    description: "List all trips for user",
    tags: ["Trips"],
    params: getTripsSchema,
    // response: {
    //  200: tripsResponseSchema,
    //  404: z.string(),
    // },
   },
  },
  async (request, reply) => {
   const { userId } = request.params;

   const trips = await prisma.trip.findMany({
    where: {
     id_user: userId,
    },
   });
   if (!trips || trips.length === 0) {
    reply.status(404);
    throw new ClientError("Trips not found.");
   }

   reply.status(200);
   return trips;
  }
 );
}
