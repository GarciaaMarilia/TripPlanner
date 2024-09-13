"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = deleteActivity;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function deleteActivity(app) {
    app.withTypeProvider().delete("/trips/:tripId/activities/:activityId", {
        schema: {
            params: zod_1.default.object({
                tripId: zod_1.default.string().uuid(),
                activityId: zod_1.default.string().uuid(),
            }),
        },
    }, async (request, reply) => {
        const { tripId, activityId } = request.params;
        try {
            const activity = await prisma_1.prisma.activity.deleteMany({
                where: {
                    id: activityId,
                    trip_id: tripId,
                },
            });
            if (activity.count === 0) {
                throw new client_error_1.ClientError("Activity not found.");
            }
            reply.status(200).send({ message: "Activity deleted successfully." });
        }
        catch (error) {
            console.error(error);
            throw new client_error_1.ClientError("An unexpected error occurred.");
        }
    });
}
