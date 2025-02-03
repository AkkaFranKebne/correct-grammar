import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import { getServerSession } from "next-auth/next"; // to handle session management
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

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

    // Generate a random reset token and set the expiry date to 24 hours from now
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const user = await prisma.user.create({
      data: {
        email,
        accessStatus: "APPROVED",
        resetToken,
        resetTokenExpiry,
      },
    });

    // construct the URL for the set-password page with the reset token
    const setPasswordUrl = `${process.env.NEXTAUTH_URL}/set-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Access Granted for Correct Grammar App - Set Your Password",
      text: `You have been granted access to the Correct Grammar App app. Please set your password by visiting in the next 24h: ${setPasswordUrl}`,
      html: `
        <p>You have been granted access to the Correct Grammar App app.</p>
        <p>Please set your password by clicking the link below in the next 24h:</p>
        <a href="${setPasswordUrl}">Set Your Password</a>
      `,
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
