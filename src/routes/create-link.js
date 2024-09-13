"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const createLinkParamsSchema = zod_1.z.object({
    tripId: zod_1.z.string().uuid(),
});
const createLinkBodySchema = zod_1.z.object({
    title: zod_1.z.string().min(4),
    url: zod_1.z.string().url(),
});
async function createLink(app) {
    app.withTypeProvider().post("/trips/:tripId/links", {
        schema: {
            params: createLinkParamsSchema,
            body: createLinkBodySchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { title, url } = request.body;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Trip not found.");
        }
        const link = await prisma_1.prisma.link.create({
            data: {
                title,
                url,
                trip_id: tripId,
            },
        });
        return { linkId: link.id };
    });
}
