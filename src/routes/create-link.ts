import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError, errorResponseSchema } from "../errors/client-error";

const createLinkParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const createLinkBodySchema = z.object({
 title: z.string().min(4),
 url: z.string().url(),
});

const createLinkResponseSchema = z.object({
 linkId: z.string().uuid(),
});

export async function createLink(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
  "/trips/:tripId/links",
  {
   schema: {
    description: "Create a link",
    tags: ["Trips"],
    params: createLinkParamsSchema,
    body: createLinkBodySchema,
    response: {
     200: createLinkResponseSchema,
     400: errorResponseSchema,
    },
   },
  },
  async (request, reply) => {
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
 );
}
