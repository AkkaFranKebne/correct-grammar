import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import bcrypt from "bcrypt"; // to hash the password
import { getServerSession } from "next-auth/next"; // to handle session management
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Retrieve the current session using getServerSession with the provided authOptions.
  const session = await getServerSession(authOptions);

  // Check if the session or session user is not available. If true, return a 401 Unauthorized response.
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the JSON body of the incoming request to extract the userId and password fields.
    const { userId, password } = await req.json();
    //@ts-expect-error  temporary fix
    if (userId !== session.user.id) {
      // Check if the userId from the request does not match the session user ID. If true, return a 401 Unauthorized response.
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if the password is not provided or its length is less than 8 characters. If true, return a 400 Bad Request response with an "Invalid password" message
    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user record in the database with the hashed password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
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
