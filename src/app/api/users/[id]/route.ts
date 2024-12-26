import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { sendEmail } from "@/lib/email";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  //@ts-expect-error  temporary fix
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    await sendEmail({
      to: user.email,
      subject: "Access Revoked",
      text: "Your access to the Grammar Checker app has been revoked.",
      html: "<p>Your access to the Grammar Checker app has been revoked.</p>",
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
