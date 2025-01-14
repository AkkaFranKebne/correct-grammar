"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInFormProps {
  onUserNotFound: () => void;
}

export default function SignInForm({ onUserNotFound }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "User not found") {
        // if the user is not found, show the access request form
        onUserNotFound();
      } else {
        setError("Invalid email or password");
      }
    } else if (result?.ok) {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-base font-medium text-gray-900">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
          aria-describedby="email-description"
        />
        <span id="email-description" className="sr-only">
          Please provide a valid email address using the format name@place.com
        </span>
      </div>
      <div>
        <Label
          htmlFor="password"
          className="text-base font-medium text-gray-900"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
          aria-describedby="password-description"
        />
        <span id="password-description" className="sr-only">
          Enter your password. The password must be at least 8 characters long.
        </span>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
      >
        Sign In
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription id="signin-error">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
