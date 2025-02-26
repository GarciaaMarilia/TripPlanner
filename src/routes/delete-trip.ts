import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const deleteTripSchema = z.object({
 tripId: z.string().uuid(),
});

export async function deleteTrip(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId",
  {
   schema: {
    description: "Delete a trip",
    tags: ["Trips"],
    params: deleteTripSchema,
    response: {
     200: z.string(),
     404: z.string(),
    },
   },
  },
  async (request, reply) => {
   try {
    const { tripId } = request.params;

    const trip = await prisma.trip.deleteMany({
     where: {
      id: tripId,
     },
    });

    if (!trip) {
     throw new ClientError("Trip not found.");
    }
    reply.status(200).send("Trip deleted successfully.");
   } catch (error) {
    console.error(error);
    throw new ClientError("An unexpected error occured.");
   }
  }
 );
}
