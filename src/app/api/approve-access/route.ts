import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { accessStatus: "APPROVED" },
    });

    await sendEmail({
      to: user.email,
      subject: "Access Approved",
      text: "Your access to the Grammar Checker app has been approved.",
      html: "<p>Your access to the Grammar Checker app has been approved.</p>",
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
