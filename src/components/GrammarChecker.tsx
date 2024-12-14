"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy, CheckCircle2 } from "lucide-react";
import { useCompletion } from "ai/react";

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleCopy = () => {
    if (completion) {
      navigator.clipboard.writeText(completion);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
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
          <CardContent
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? "h-auto" : "h-40"
            }`}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsExpanded(e.target.scrollHeight > 160);
              }}
              onKeyDown={handleKeyDown}
              className={`h-full resize-none ${
                isExpanded ? "min-h-[10rem]" : ""
              }`}
            />
            <Button onClick={handleCheck} disabled={isLoading} className="mt-2">
              {isLoading ? "Checking..." : "Check Grammar"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Corrected Text
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!completion}
              >
                {isCopied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? "h-auto" : "h-40"
            }`}
          >
            <div
              className={`p-2 border rounded-md overflow-auto ${
                isExpanded ? "min-h-[10rem]" : "h-full"
              }`}
            >
              {completion || "Corrected text will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
