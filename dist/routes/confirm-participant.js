"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmParticipants = confirmParticipants;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const confirmParticipantSchema = zod_1.default.object({
    participantId: zod_1.default.string().uuid(),
});
async function confirmParticipants(app) {
    app.withTypeProvider().get("/participants/:participantId/confirm", {
        schema: {
            params: confirmParticipantSchema,
        },
    }, async (request, reply) => {
        const { participantId } = request.params;
        const participant = await prisma_1.prisma.participant.findUnique({
            where: { id: participantId },
        });
        if (!participant) {
            throw new client_error_1.ClientError("Participant not found.");
        }
        if (participant.is_confirmed) {
            return reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`);
        }
        await prisma_1.prisma.participant.update({
            where: { id: participantId },
            data: { is_confirmed: true },
        });
        return reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`);
    });
}
