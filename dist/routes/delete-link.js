"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLink = deleteLink;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function deleteLink(app) {
    app.withTypeProvider().delete("/trips/:tripId/links/:linkId", {
        schema: {
            params: zod_1.default.object({
                tripId: zod_1.default.string().uuid(),
                linkId: zod_1.default.string().uuid(),
            }),
        },
    }, async (request, reply) => {
        const { tripId, linkId } = request.params;
        try {
            const link = await prisma_1.prisma.link.deleteMany({
                where: {
                    id: linkId,
                    trip_id: tripId,
                },
            });
            if (link.count === 0) {
                throw new client_error_1.ClientError("Link not found.");
            }
            reply.status(200).send({ message: "Link deleted successfully." });
        }
        catch (error) {
            console.error(error);
            throw new client_error_1.ClientError("An unexpected error occured.");
        }
    });
}
