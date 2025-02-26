import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { DeleteTripParamsSchema } from "../routes/delete-trip";

export async function deteleTripController(
 request: FastifyRequest<{ Params: DeleteTripParamsSchema }>,
 reply: FastifyReply
) {
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
