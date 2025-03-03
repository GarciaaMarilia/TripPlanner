import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";

const confirmParticipantSchema = z.object({
 participantId: z.string().uuid(),
});

export async function confirmParticipants(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/participants/:participantId/confirm",
  {
   schema: {
    description: "Confirm a participant",
    tags: ["Participants"],
    params: confirmParticipantSchema,
   },
  },
  async (request, reply) => {
   const { participantId } = request.params;

   const participant = await prisma.participant.findUnique({
    where: { id: participantId },
   });

   if (!participant) {
    throw new ClientError("Participant not found.");
   }

   if (participant.is_confirmed) {
    return reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`);
   }

   await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
   });

   return reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`);
  }
 );
}
