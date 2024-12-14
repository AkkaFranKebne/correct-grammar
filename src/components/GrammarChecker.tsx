"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useChat, useCompletion } from "ai/react";

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutoutText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { append, messages, isLoading } = useChat({
    streamProtocol: "text",
    api: "/api/check-grammar",
    onResponse: async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(response.statusText);
      }
      setError(null);
      const body = await response.json();
      setOutoutText(body.choices[0].message.content);
    },
    onError: (error) => {
      console.error("Error:", error);
      setError(
        "An error happened while checking the text. Please try again later."
      );
    },
  });

  const handleCheck = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to check.");
      return;
    }
    setError(null);
    append({
      role: "user",
      content: `Please correct the grammar and orthography in the following text, provide the corrected text only, without any explanations.: "${inputText}"`,
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
              {outputText || "Corrected text will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
