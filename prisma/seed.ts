import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping creation.");
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Admin User",
          role: "ADMIN",
          accessStatus: "APPROVED",
          password: hashedPassword,
        },
      });

      console.log("Admin user created:", adminUser);
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unhandled error during seeding:", error);
  process.exit(1);
});
