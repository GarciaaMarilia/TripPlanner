import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { DeleteLinkParamsSchema } from "../routes/delete-link";

export async function deleteLinkController(
 request: FastifyRequest<{ Params: DeleteLinkParamsSchema }>,
 reply: FastifyReply
) {
 const { tripId, linkId } = request.params;

 try {
  const link = await prisma.link.deleteMany({
   where: {
    id: linkId,
    trip_id: tripId,
   },
  });
  if (link.count === 0) {
   throw new ClientError("Link not found.");
  }
  reply.status(200).send({ message: "Link deleted successfully." });
 } catch (error) {
  console.error(error);
  throw new ClientError("An unexpected error occured.");
 }
}
