"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import AccessRequestForm from "@/components/AccessRequestForm";

export default function SignInPage() {
  const [showAccessRequest, setShowAccessRequest] = useState(false);

  // if the user is not found, show the access request form
  const handleUserNotFound = () => {
    setShowAccessRequest(true);
  };

  if (showAccessRequest) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Request Access</h1>
        <AccessRequestForm />
        <Button onClick={() => setShowAccessRequest(false)} className="mt-4">
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignInForm onUserNotFound={handleUserNotFound} />
      <div className="mt-4">
        {/*       <Button variant="outline" onClick={() => signIn("email")}>
          Sign In with Email Link
        </Button> */}
        <Button variant="secondary" onClick={() => setShowAccessRequest(true)}>
          Request Access
        </Button>
      </div>
    </div>
  );
}
