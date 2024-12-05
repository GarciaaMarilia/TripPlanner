import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function deleteTrip(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId",
  {
   schema: {
    params: z.object({
     tripId: z.string().uuid(),
    }),
   },
  },
  async (request, reply) => {
   const { tripId } = request.params;

   try {
    const trip = await prisma.trip.delete({
     where: {
      id: tripId,
     },
    });
    if (!trip) {
     throw new ClientError("Trip not found.");
    }
    reply.status(200).send({ message: "Trip deleted successfully." });
   } catch (error) {
    console.error(error);
    throw new ClientError("An unexpected error occured.");
   }
  }
 );
}
