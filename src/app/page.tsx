import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import GrammarChecker from "@/components/GrammarChecker";
import SetPasswordForm from "@/components/SetPasswordForm";
import prisma from "@/lib/prisma";

/*
Server Component in Next.js App Router.
Server Components can directly access the database because they run on the server.
This approach is more efficient as it eliminates the need for an additional API call.
It's secure because the database call never reaches the client-side code.

For server components (like pages or layouts in the App Router), use direct database access when possible.
*/

export default async function Home() {
  // retrieve the current user's session on the server side.
  const session = await getServerSession(authOptions);

  // if the session or session user is not available redirects the user to the sign-in page.
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // if the user's access status is not "APPROVED" returns a message indicating that access is pending.

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

  // Queries the database to find the user by their ID and selects the password field
  const user = await prisma.user.findUnique({
    //@ts-expect-error  temporary fix
    where: { id: session.user.id },
    select: { password: true },
  });

  // returns a form for the user to set their password if the user's password is not set
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

  // returns the GrammarChecker component if the user's password is set
  return <GrammarChecker />;
}
