import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import prisma from "../../lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany();

  return <AdminPanel initialUsers={users} />;
}
