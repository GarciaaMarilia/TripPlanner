import { FastifyReply, FastifyRequest } from "fastify";

import {
 CreateLinkBodySchema,
 CreateLinkParamsSchema,
} from "../routes/create-link";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function createLinkController(
 request: FastifyRequest<{
  Body: CreateLinkBodySchema;
  Params: CreateLinkParamsSchema;
 }>,
 reply: FastifyReply
) {
 try {
  const { tripId } = request.params;
  const { title, url } = request.body;

  const trip = await prisma.trip.findUnique({
   where: { id: tripId },
  });

  if (!trip) {
   throw new ClientError("Trip not found.");
  }

  const link = await prisma.link.create({
   data: {
    title,
    url,
    trip_id: tripId,
   },
  });

  return { linkId: link.id };
 } catch (error: unknown) {
  if (error instanceof ClientError) {
   reply.status(400).send({ error: error.message });
  }
 }
}
