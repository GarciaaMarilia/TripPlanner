import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../lib/prisma";
import { FastifyTypedInstance } from "../types";
import { ClientError, errorResponseSchema } from "../errors/client-error";

const getLinksParamsSchema = z.object({
 tripId: z.string().uuid(),
});

const linkSchema = z.object({
 id: z.string().uuid(),
 title: z.string(),
 url: z.string().url(),
 trip_id: z.string().uuid(),
});

const getLinksResponseSchema = z.object({ links: z.array(linkSchema) });

export async function getLinks(app: FastifyTypedInstance) {
 app.withTypeProvider<ZodTypeProvider>().get(
  "/trips/:tripId/links",
  {
   schema: {
    description: "List all links for a trip",
    tags: ["Trips"],
    params: getLinksParamsSchema,
    response: {
     200: getLinksResponseSchema,
     400: errorResponseSchema,
    },
   },
  },
  async (request, reply) => {
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
 );
}
