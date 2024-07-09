import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
 log: ["query"], // mostra no console as query que estao sendo feitas no BD
});
