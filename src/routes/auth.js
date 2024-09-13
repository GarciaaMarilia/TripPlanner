"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = __importDefault(require("zod"));
const authService_1 = require("../authService");
const registerSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
    name: zod_1.default.string(),
});
const loginSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
async function authRoutes(app) {
    app.withTypeProvider().post("/register", {
        schema: {
            body: registerSchema,
        },
    }, async (request) => {
        const { email, password, name } = request.body;
        const user = await (0, authService_1.Register)(email, password, name);
        return {
            user: user,
        };
    });
    app.withTypeProvider().post("/login", {
        schema: {
            body: loginSchema,
        },
    }, async (request, reply) => {
        try {
            const { email, password } = request.body;
            const response = await (0, authService_1.Login)(email, password);
            return { token: response.token, user: response.user };
        }
        catch (error) {
            reply.status(401).send({ error: error.message });
        }
    });
}
