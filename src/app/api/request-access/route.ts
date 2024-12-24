import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, name } = await req.json();

    const user = await prisma.user.create({
      data: { email, name, accessStatus: "PENDING" },
    });

    await sendEmail({
      to: "ewa.wrobel@gmail.com",
      subject: "New Access Request",
      text: `${name} (${email}) has requested access to the Grammar Checker app.`,
      html: `
        <p>${name} (${email}) has requested access to the Grammar Checker app.</p>
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
