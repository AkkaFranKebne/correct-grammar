"use client";

import type React from "react";
import { useState } from "react";
import SignInForm from "@/components/SignInForm";
import { Button } from "@/components/ui/button";
import AccessRequestForm from "@/components/AccessRequestForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInPanelProps {
  title: string;
}

const SignInPanel: React.FC<SignInPanelProps> = ({ title }) => {
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  console.log("SignInPanelProps", title);
  // if the user is not found, show alert and then the access request form after 3 seconds
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
          variant="secondary"
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
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
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
        {/*    <Button variant="outline" onClick={() => signIn("email")}>
          Sign In with Email Link
        </Button> */}
        <Button variant="secondary" onClick={() => setShowAccessRequest(true)}>
          Request Access
        </Button>
      </div>
    </div>
  );
};

export default SignInPanel;
