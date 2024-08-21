import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function deleteActivity(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId/activities/:activityId",
  {
   schema: {
    params: z.object({
     tripId: z.string().uuid(),
     activityId: z.string().uuid(),
    }),
   },
  },
  async (request, reply) => {
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
 );
}