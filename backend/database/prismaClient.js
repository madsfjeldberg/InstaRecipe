import { PrismaClient } from '../generated/prisma/index.js';
import { withOptimize } from '@prisma/extension-optimize';
import { withAccelerate } from '@prisma/extension-accelerate';

// const prisma = new PrismaClient().$extends(
//   withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
// ).$extends(withAccelerate());

const prisma = new PrismaClient({
  log: ['warn', 'error'],
  errorFormat: 'pretty',
}).$extends(
  withAccelerate(),
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
  
);

export default prisma;