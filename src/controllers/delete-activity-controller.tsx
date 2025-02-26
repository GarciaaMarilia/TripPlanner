import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { DeleteActivityParamsSchema } from "../routes/delete-activity";

export async function deleteActivityController(
 request: FastifyRequest<{ Params: DeleteActivityParamsSchema }>,
 reply: FastifyReply
) {
 const { tripId, activityId } = request.params;

 try {
  const activity = await prisma.activity.deleteMany({
   where: {
    id: activityId,
    trip_id: tripId,
   },
  });

  if (activity.count === 0) {
   throw new ClientError("Activity not found.");
  }
  reply.status(200).send({ message: "Activity deleted successfully." });
 } catch (error) {
  console.error(error);
  throw new ClientError("An unexpected error occurred.");
 }
}
