import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

const getParticipantSchema = z.object({
 participantId: z.string().uuid(),
});

export async function getParticipant(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/participants/:participantId",
  {
   schema: {
    params: getParticipantSchema,
   },
  },
  async (request) => {
   const { participantId } = request.params;

   const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    select: {
     id: true,
     name: true,
     email: true,
     is_confirmed: true,
    },
   });

   if (!participant) {
    throw new ClientError("Participant not found.");
   }

   return {
    participant,
   };
  }
 );
}
