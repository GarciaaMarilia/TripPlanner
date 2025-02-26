import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { getActivitiesController } from "../controllers/get-activities-controller";

const activitySchema = z.object({
 id: z.string().uuid(),
 trip_id: z.string().uuid(),
 title: z.string().min(4),
 occurs_at: z.coerce.date(),
});

const getActivitiesParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const activitiesResponseSchema = z.array(
 z.object({
  data: z.coerce.date(),
  activities: z.array(activitySchema),
 })
);

export type GetActivitesParamsSchema = z.infer<
 typeof getActivitiesParamsSchema
>;

export type Activity = z.infer<typeof activitySchema>;

export async function getActivity(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/activities",
  {
   schema: {
    description: "List all activities for a trip",
    tags: ["Activities"],
    params: getActivitiesParamsSchema,
    response: {
     200: activitiesResponseSchema,
    },
   },
  },
  getActivitiesController
 );
}
