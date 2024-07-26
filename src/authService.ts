const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function Register(email: string, password: string, name: string) {
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

export async function Login(email: string, password: string) {
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
