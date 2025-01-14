"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SetPasswordFormProps {
  userId: string;
}

export default function SetPasswordForm({ userId }: SetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if the password and confirmPassword values match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // An asynchronous fetch request to the /api/set-password endpoint
      const response = await fetch("/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        setMessage("Password set successfully");
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Error setting password");
      }
      // @ts-expect-error temporary fix
    } catch (error: string) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          htmlFor="password"
          className="text-base font-medium text-gray-900"
        >
          New Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="mt-1 text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
          aria-describedby="password-description"
        />
      </div>
      <span id="password-description" className="sr-only">
        Enter a new password (minimum 8 characters)
      </span>

      <div>
        <Label
          htmlFor="confirmPassword"
          className="text-base font-medium text-gray-900"
        >
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="mt-1 text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
          aria-describedby="confirm-password-description"
        />
      </div>
      <span id="confirm-password-description" className="sr-only">
        Confirm your new password
      </span>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
      >
        Set Password
      </Button>
      {message && (
        <Alert>
          <AlertDescription id="password-success">{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription id="password-error">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
