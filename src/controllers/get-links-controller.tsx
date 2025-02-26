import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { GetLinksParamsSchema } from "../routes/get-links";

export async function getLinksController(
 request: FastifyRequest<{ Params: GetLinksParamsSchema }>,
 reply: FastifyReply
) {
 try {
  const { tripId } = request.params;

  const trip = await prisma.trip.findUnique({
   where: { id: tripId },
   include: {
    links: true,
   },
  });

  if (!trip) {
   throw new ClientError("Trip not found.");
  }

  return { links: trip.links };
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(400).send({ error: error.message });
  }
 }
}
