import { PrismaClient } from '../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: ["warn", "error"],
  errorFormat: "pretty",
}).$extends(withAccelerate());

export default prisma;
