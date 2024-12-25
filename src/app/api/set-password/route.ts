import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.accessStatus !== "APPROVED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: session.user.email! },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { message: "Error setting password" },
      { status: 500 }
    );
  }
}