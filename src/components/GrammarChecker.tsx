"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCompletion } from "ai/react";

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/check-grammar",
    onError: (error) => {
      console.error("Error:", error);
      setError("An error occurred while checking the text. Please try again.");
    },
  });

  const handleCheck = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to check.");
      return;
    }
    setError(null);
    complete(inputText);
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
              {completion || "Corrected text will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
