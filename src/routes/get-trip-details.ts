import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";

export async function getTripDetails(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId",
  {
   schema: {
    params: z.object({
     tripId: z.string().uuid(),
    }),
   },
  },
  async (request) => {
   const { tripId } = request.params;

   const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
     id: true,
     destination: true,
     starts_at: true,
     ends_at: true,
     is_confirmed: true,
    },
   });

   if (!trip) {
    throw new Error("Trip not found.");
   }

   return {
    trip,
   };
  }
 );
}
