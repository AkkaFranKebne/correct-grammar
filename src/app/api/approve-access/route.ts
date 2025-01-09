import { NextRequest, NextResponse } from "next/server"; // to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // to interact with the database.
import { sendEmail } from "@/lib/email"; // to send emails.

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

  // Use the prisma client to update a user record in the database.
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { accessStatus: "APPROVED" },
    });

    // Send an email to the user notifying them that their access has been approved.
    await sendEmail({
      to: user.email,
      subject: "Access Approved",
      text: "Your access to the Correct Grammar app has been approved.",
      html: "<p>Your access to the Correct Grammar app has been approved.</p>",
    });

    return NextResponse.json({ message: "Access approved successfully" });
  } catch (error) {
    console.error("Error approving access:", error);
    return NextResponse.json(
      { message: "Error approving access" },
      { status: 500 }
    );
  }
}
