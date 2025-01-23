import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const getTripDetailsSchema = z.object({
 tripId: z.string().uuid(),
});

export async function getTripDetails(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId",
  {
   schema: {
    tags: ["Trips"],
    params: getTripDetailsSchema,
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
    throw new ClientError("Trip not found.");
   }

   return {
    trip,
   };
  }
 );
}
