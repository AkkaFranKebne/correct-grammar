import { PrismaClient } from "@prisma/client";

/*
Ensures that only one instance of PrismaClient is created and reused throughout the application.
*/

/* eslint-disable no-var */

// The declare global block extends the global scope to include a prisma variable of type PrismaClient or undefined, to avoid TypeScript errors when accessing global.prisma.
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // A new instance of PrismaClient is created and assigned to prisma if the application is running in production mode.
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    // A new instance of PrismaClient is created and assigned to global.prisma if it doesn't already exist.
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
