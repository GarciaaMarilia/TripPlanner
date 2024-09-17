"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = Register;
exports.Login = Login;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function Register(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
    return user;
}
async function Login(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("invalid password");
    }
    const token = jwt.sign({ userId: user.id }, "your_jwt-secret", {
        expiresIn: "1h",
    });
    return { token, user };
}
