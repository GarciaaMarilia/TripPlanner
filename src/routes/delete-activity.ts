import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError } from "../errors/client-error";
import { deleteActivityController } from "../controllers/delete-activity-controller";

const deleteActivitySchema = z.object({
 tripId: z.string().uuid(),
 activityId: z.string().uuid(),
});

export type DeleteActivityParamsSchema = z.infer<typeof deleteActivitySchema>;

export async function deleteActivity(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().delete(
  "/trips/:tripId/activities/:activityId",
  {
   schema: {
    description: "Delete an activity",
    tags: ["Activities"],
    params: deleteActivitySchema,
   },
  },
  deleteActivityController
 );
}
