import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

const getTripsSchema = z.object({
 userId: z.string().uuid(),
});

export async function getTrips(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/listTrips/:userId",
  {
   schema: {
    params: getTripsSchema,
   },
  },
  async (request) => {
   const { userId } = request.params;

   const trips = await prisma.trip.findMany({
    where: {
     participants: {
      some: {
       id: userId,
      },
     },
    },
    include: {
     participants: true,
    },
   });

   if (!trips) {
    throw new ClientError("Trips not found.");
   }

   return {
    trips,
   };
  }
 );
}