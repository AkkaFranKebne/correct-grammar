"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccessRequestForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // An asynchronous fetch request to the /api/request-access endpoint
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setEmail("");
        setName("");
      } else {
        setError(data.message || "An error occurred");
      }
      // @ts-expect-error temporary fix
    } catch (error: string) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-base font-medium text-gray-900">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
          aria-describedby="name-description"
        />
      </div>
      <span id="name-description" className="sr-only">
        Enter your full name
      </span>
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
      </div>
      <span id="email-description" className="sr-only">
        Please provide a valid email address using the format name@place.com
      </span>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
      >
        Request Access
      </Button>
      {message && (
        <Alert>
          <AlertDescription id="request-success">{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription id="request-error">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
