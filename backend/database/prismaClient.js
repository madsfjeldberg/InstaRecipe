import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient({
  log: ["warn", "error"],
  errorFormat: "pretty",
});

export default prisma;
