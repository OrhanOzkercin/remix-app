import { PrismaClient } from "@prisma/client"; // Changed to edge client

declare global {
  // eslint-disable-next-line no-var
  let prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
  });

  // Validate database connection
  prisma.$connect()
    .then(() => {
      console.log('✅ Successfully connected to database in production');
    })
    .catch((error) => {
      console.error('❌ Failed to connect to database:', error);
      process.exit(1);
    });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    
    // Optional: Add connection logging
    console.log("🔄 Created new Prisma client instance");
  }
  prisma = global.prisma;
  
  // Remove explicit $connect() - let it connect on first use
}

export { prisma };