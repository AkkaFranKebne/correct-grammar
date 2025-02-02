import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import bcrypt from "bcrypt"; // to hash the password

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Parse the JSON body of the incoming request to extract the token and password fields.
  try {
    const { password, token } = await req.json();

    if (!password || !token) {
      return NextResponse.json(
        { message: "Password and token are required" },
        { status: 400 }
      );
    }
    // Search the database for a user with the provided reset token and a reset token expiry date greater than the current date.
    const user = await prisma.user.findFirst({
      where: {
        //@ts-expect-error  temporary fix
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the user record in the database with the hashed password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        //@ts-expect-error  temporary fix
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { message: "Error setting password" },
      { status: 500 }
    );
  }
}
