import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import GrammarChecker from "@/components/GrammarChecker";
import SetPasswordForm from "@/components/SetPasswordForm";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }
  //@ts-expect-error  temporary fix
  if (session.user.accessStatus !== "APPROVED") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Access Pending</h1>
        <p>
          Your access request is being reviewed. We will notify you once it is
          approved.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    //@ts-expect-error  temporary fix
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Set Your Password</h1>
        <p className="mb-4">
          Please set a password to access the Grammar Checker.
        </p>
        <SetPasswordForm
          //@ts-expect-error  temporary fix
          userId={session.user.id}
        />
      </div>
    );
  }

  return <GrammarChecker />;
}
