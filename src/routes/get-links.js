"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinks = getLinks;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const getLinksSchema = zod_1.default.object({
    tripId: zod_1.default.string().uuid(),
});
async function getLinks(app) {
    app.withTypeProvider().get("/trips/:tripId/links", {
        schema: {
            params: getLinksSchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                links: true,
            },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Trip not found.");
        }
        return {
            links: trip.links,
        };
    });
}
