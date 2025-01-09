"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // allows you to programmatically change routes inside Client Components.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AccessRequestForm from "@/components/AccessRequestForm";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // attempt to sign in using the signIn function with credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "User not found") {
        // if the user is not found, show the access request form
        setShowAccessRequest(true);
      } else {
        setError("Invalid email or password");
      }
      // redirect user to the home page if sign in is successful
    } else if (result?.ok) {
      router.push("/");
    }
  };

  // if the user is not found, show the access request form
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

  // sign in form
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Sign In</Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
