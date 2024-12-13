"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCompletion } from "ai/react";

export default function Home() {
  const [inputText, setInputText] = useState("");

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/check-grammar",
    onResponse: (response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleCheck = () => {
    complete(inputText);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Let AI check grammar for you:</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-40"
            />
            <Button onClick={handleCheck} disabled={isLoading} className="mt-2">
              {isLoading ? "Checking..." : "Check Grammar"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Corrected Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 p-2 border rounded-md overflow-auto">
              {completion || "Corrected text will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
