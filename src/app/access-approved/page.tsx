import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Access Approved | Grammar Checker",
  description: "Access approval confirmation for Grammar Checker",
};

export default function AccessApprovedPage() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Access Approved
          </CardTitle>
          <CardDescription className="text-center">
            {"The user's access has been successfully approved."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="mb-4 text-center">
            An email has been sent to the user with instructions to set their
            password.
          </p>
          <Button asChild>
            <Link href="/admin">Return to Admin Panel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
