import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import { getServerSession } from "next-auth/next"; // to handle session management
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { sendEmail } from "@/lib/email";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // Await the params from the props to get the user ID
  const params = await props.params;
  // Retrieve the current session using the provided authentication options
  const session = await getServerSession(authOptions);

  //@ts-expect-error  temporary fix
  if (!session || session.user.role !== "ADMIN") {
    // Check if the session is invalid or if the user does not have an ADMIN role, return a 403 Forbidden response if the user is not authorized
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  try {
    // Delete the user from the database with the provided ID
    const user = await prisma.user.delete({
      where: { id },
    });

    // Send an email to the deleted user notifying them of their revoked access
    await sendEmail({
      to: user.email,
      subject: "Access Revoked",
      text: "Your access to the Correct Grammar app has been revoked.",
      html: "<p>Your access to the Correct Grammar app has been revoked.</p>",
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
