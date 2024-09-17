"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipants = getParticipants;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const getParticipantsSchema = zod_1.default.object({
    tripId: zod_1.default.string().uuid(),
});
async function getParticipants(app) {
    app.withTypeProvider().get("/trips/:tripId/participants", {
        schema: {
            params: getParticipantsSchema,
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        is_confirmed: true,
                    },
                },
            },
        });
        if (!trip) {
            throw new client_error_1.ClientError("Trip not found.");
        }
        return {
            participants: trip.participants,
        };
    });
}
