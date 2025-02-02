"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SetPasswordForm from "@/components/SetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(
        "Invalid or missing token. Please use the link provided in your email."
      );
    }
  }, []);

  const handlePasswordSet = () => {
    router.push("/auth/signin");
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Your Password</h1>
      <SetPasswordForm token={token} onPasswordSet={handlePasswordSet} />
    </div>
  );
}
