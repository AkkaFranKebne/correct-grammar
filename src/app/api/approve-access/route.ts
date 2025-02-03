import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email"; // to send emails.
import crypto from "crypto"; // to generate random tokens.

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Extracts the userId from the query parameters of the request URL
  const userId = req.nextUrl.searchParams.get("userId");

  // If userId is not provided, returns a JSON response with a status code of 400 (Bad Request) and a message indicating that the user ID is required.
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Generate a random reset token and set the expiry date to 24 hours from now
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Use the prisma client to update a user record in the database.
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        accessStatus: "APPROVED",
        resetToken,
        resetTokenExpiry,
      },
    });

    // Construct the URL for the set-password page with the reset token
    const setPasswordUrl = `${process.env.NEXTAUTH_URL}/set-password?token=${resetToken}`;

    // Send an email to the user notifying them that their access has been approved.
    await sendEmail({
      to: user.email,
      subject: "Access to Correct Grammar app approved - Set Your Password",
      text: `Your access to the Correct Grammar app has been approved. Please set your password by visiting: ${setPasswordUrl}`,
      html: `
        <p>Your access to the Correct Grammar app has been approved.</p>
        <p>Please set your password by clicking the link below:</p>
        <a href="${setPasswordUrl}">Set Your Password</a>
      `,
    });

    // Redirect to the access-approved page
    return NextResponse.redirect(new URL("/access-approved", req.url));
  } catch (error) {
    console.error("Error approving access:", error);
    return NextResponse.json(
      { message: "Error approving access" },
      { status: 500 }
    );
  }
}
