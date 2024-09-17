"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailClient = getMailClient;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function getMailClient() {
    const account = await nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });
    return transporter;
}
