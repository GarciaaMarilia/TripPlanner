import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

export async function deleteParticipant(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId/participants/:participantId",
  {
   schema: {
    tags: ["Participants"],
    params: z.object({
     tripId: z.string().uuid(),
     participantId: z.string().uuid(),
    }),
   },
  },
  async (request, reply) => {
   const { tripId, participantId } = request.params;

   try {
    const trip = await prisma.trip.findUnique({
     where: { id: tripId },
     include: { participants: true },
    });

    if (!trip) {
     throw new ClientError("Trip not found.");
    }

    const participantExists = trip.participants.some(
     (participant) => participant.id === participantId
    );

    if (!participantExists) {
     throw new ClientError("Participant not found in the specified trip.");
    }

    await prisma.trip.update({
     where: { id: tripId },
     data: {
      participants: {
       delete: { id: participantId },
      },
     },
    });

    reply.status(200).send({ message: "Participant deleted successfully." });
   } catch (error) {
    console.error(error);
    throw new ClientError("An unexpected error occured.");
   }
  }
 );
}
