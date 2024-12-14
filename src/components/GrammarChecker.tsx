"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy, CheckCircle2, X } from "lucide-react";
import { useCompletion } from "ai/react";

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/check-grammar",
    onError: (error) => {
      console.error("Error:", error);
      setError("An error occurred while checking the text. Please try again.");
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      setIsInputExpanded(textareaRef.current.scrollHeight > 160);
    }
  }, [inputText]);

  useEffect(() => {
    if (outputRef.current) {
      setIsOutputExpanded(outputRef.current.scrollHeight > 160);
    }
  }, [completion]);

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

  const handleClearInput = () => {
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsInputExpanded(false);
  };

  const handleClearOutput = () => {
    setCompletion("");
    setIsOutputExpanded(false);
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
            <CardTitle className="flex justify-between items-center">
              Input Text
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearInput}
                disabled={!inputText}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`flex flex-col transition-all duration-300 ease-in-out ${
              isInputExpanded ? "h-auto" : "h-40"
            }`}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              className={`flex-grow resize-none text-sm text-gray-900 ${
                isInputExpanded ? "min-h-[10rem]" : ""
              }`}
            />
            <Button
              onClick={handleCheck}
              disabled={isLoading}
              className="mt-2 self-start"
            >
              {isLoading ? "Checking..." : "Check Grammar"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Corrected Text
              <div className="flex gap-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearOutput}
                  disabled={!completion}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`flex flex-col transition-all duration-300 ease-in-out ${
              isOutputExpanded ? "h-auto" : "h-40"
            }`}
          >
            <div
              ref={outputRef}
              className={`flex-grow p-2 border rounded-md overflow-auto text-sm text-gray-900 ${
                isOutputExpanded ? "min-h-[10rem]" : ""
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
