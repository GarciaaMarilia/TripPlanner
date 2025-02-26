import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { ConfirmParticipantParamsSchema } from "../routes/confirm-participant";

export async function confirmParticipantController(
 request: FastifyRequest<{ Params: ConfirmParticipantParamsSchema }>,
 reply: FastifyReply
) {
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
