import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { createActivityController } from "../controllers/create-activity-controller";

const createActivityParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const createActivityBodySchema = z.object({
 title: z.string().min(4),
 occurs_at: z.coerce.date(),
});

const createActivityResponseSchema = z.object({
 activityId: z.string().uuid(),
});

export type CreateActivityParamsSchema = z.infer<
 typeof createActivityParamsSchema
>;
export type CreateActivityBodySchema = z.infer<typeof createActivityBodySchema>;

export async function createActivity(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/activities",
  {
   schema: {
    description: "Create an activity",
    tags: ["Activities"],
    params: createActivityParamsSchema,
    body: createActivityBodySchema,
    response: {
     201: createActivityResponseSchema,
     204: z.string(),
     400: z.object({ error: z.string() }),
    },
   },
  },
  createActivityController
 );
}
