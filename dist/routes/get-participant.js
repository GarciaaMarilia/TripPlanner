"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipant = getParticipant;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const getParticipantSchema = zod_1.default.object({
    participantId: zod_1.default.string().uuid(),
});
async function getParticipant(app) {
    app.withTypeProvider().get("/participants/:participantId", {
        schema: {
            params: getParticipantSchema,
        },
    }, async (request) => {
        const { participantId } = request.params;
        const participant = await prisma_1.prisma.participant.findUnique({
            where: { id: participantId },
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true,
            },
        });
        if (!participant) {
            throw new client_error_1.ClientError("Participant not found.");
        }
        return {
            participant,
        };
    });
}
