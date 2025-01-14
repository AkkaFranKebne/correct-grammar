"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import AccessRequestForm from "@/components/AccessRequestForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignInPage() {
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  // if the user is not found, show alert and than the access request form after 10 seconds
  const handleUserNotFound = () => {
    setIsUserNotFound(true);
    setTimeout(() => {
      setShowAccessRequest(true);
      setIsUserNotFound(false);
    }, 3000);
  };

  if (showAccessRequest) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Request Access</h1>
        <AccessRequestForm />
        <Button
          onClick={() => {
            setShowAccessRequest(false);
            setIsUserNotFound(false);
          }}
          className="mt-4"
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      {isUserNotFound && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            User not found. You will be redirected to the access request form
            shortly.
          </AlertDescription>
        </Alert>
      )}
      <SignInForm onUserNotFound={handleUserNotFound} />
      <div className="mt-4">
        <Button variant="outline" onClick={() => signIn("email")}>
          Sign In with Email Link
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowAccessRequest(true)}
          className="ml-2"
        >
          Request Access
        </Button>
      </div>
    </div>
  );
}
