import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables"
      );
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Updating if necessary.");

      // Update admin user if needed (e.g., to add new fields)
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: "ADMIN",
          accessStatus: "APPROVED",
        },
      });
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Admin User",
          role: "ADMIN",
          accessStatus: "APPROVED",
          password: hashedPassword,
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
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
