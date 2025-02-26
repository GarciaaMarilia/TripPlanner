import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { FastifyTypedInstance } from "../types";
import { confirmParticipantController } from "../controllers/confirm-participant-controller";

const confirmParticipantParamsSchema = z.object({
 participantId: z.string().uuid(),
});

export type ConfirmParticipantParamsSchema = z.infer<
 typeof confirmParticipantParamsSchema
>;

export async function confirmParticipants(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/participants/:participantId/confirm",
  {
   schema: {
    description: "Confirm a participant",
    tags: ["Participants"],
    params: confirmParticipantParamsSchema,
   },
  },
  confirmParticipantController
 );
}
