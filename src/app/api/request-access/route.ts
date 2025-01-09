import { NextRequest, NextResponse } from "next/server"; // used to handle incoming HTTP requests and send responses in a Next.js API route.
import prisma from "@/lib/prisma"; // Prisma client instance from the lib/prisma module. This is used to interact with the database
import { sendEmail } from "@/lib/email"; // to send emails

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    //Parse the JSON body of the incoming request to extract the email and name fields
    const { email, name } = await req.json();

    // Use the Prisma client to create a new user record in the database with the provided email and name, and sets the accessStatus to "PENDING".
    const user = await prisma.user.create({
      data: { email, name, accessStatus: "PENDING" },
    });

    // Send an email notification to the admin with the user's name and email, along with a link to approve the access request.
    await sendEmail({
      to: "ewa.wrobel@gmail.com",
      subject: "New Access Request from Correct Grammar App",
      text: `${name} (${email}) has requested access to the Correct Grammar app.`,
      html: `
        <p>${name} (${email}) has requested access to the Correct Grammar app.</p>
        <a href="${process.env.NEXTAUTH_URL}/api/approve-access?userId=${user.id}">Approve Access</a>
      `,
    });

    return NextResponse.json({
      message: "Access request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error submitting access request" },
      { status: 500 }
    );
  }
}
