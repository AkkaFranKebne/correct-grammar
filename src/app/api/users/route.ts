import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  //@ts-expect-error  temporary fix
  if (!session || session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { email } = await req.json();

    const user = await prisma.user.create({
      data: { email, accessStatus: "APPROVED" },
    });

    await sendEmail({
      to: email,
      subject: "Access Granted",
      text: "You have been granted access to the Grammar Checker app.",
      html: "<p>You have been granted access to the Grammar Checker app.</p>",
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
