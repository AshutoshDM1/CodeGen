import { PrismaClient } from '.prisma/client';

// Disable ESLint's no-var rule only for the global declaration
/* eslint-disable no-var */
declare global {
  var prisma: PrismaClient | undefined; // Global var declaration for Prisma client
}
/* eslint-enable no-var */

// Check if Prisma is already in the global object
let prismaMain: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaMain = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prismaMain = globalThis.prisma;
}

// Export the Prisma client
export const prisma = prismaMain;
