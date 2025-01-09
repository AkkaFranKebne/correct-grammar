import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import { getServerSession } from "next-auth/next"; // to handle session management
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Retrieve the current session using the provided authentication options
  const session = await getServerSession(authOptions);

  //@ts-expect-error  temporary fix
  if (!session || session?.user?.role !== "ADMIN") {
    // Check if the session is invalid or if the user does not have an ADMIN role, return a 403 Forbidden response if the user is not authorized
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    // Parse the request body to extract the email field
    const { email } = await req.json();

    // Create a new user in the database with the provided email and approved access status
    const user = await prisma.user.create({
      data: { email, accessStatus: "APPROVED" },
    });

    await sendEmail({
      to: email,
      subject: "Access Granted for Correct Grammar App",
      text: "You have been granted access to the Correct Grammar app.",
      html: "<p>You have been granted access to the Correct Grammar app.</p>",
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
