"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useCompletion } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy, CheckCircle2, X } from "lucide-react";

export default function GrammarChecker() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // complete - function to send the text to the API for grammar checking; completion - the corrected text returned by the API; isLoading - loading state of the API request; setCompletion - function to set the corrected text
  const { complete, completion, isLoading, setCompletion } = useCompletion({
    // Setting the API endpoint for grammar checking.
    api: "/api/check-grammar",
    onError: (error) => {
      console.error("Error:", error);
      setError("An error occurred while checking the text. Please try again.");
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      // Setting isInputExpanded based on the textarea's scroll height on inputText change
      setIsInputExpanded(textareaRef.current.scrollHeight > 160);
    }
  }, [inputText]);

  useEffect(() => {
    if (outputRef.current) {
      // Setting isOutputExpanded based on the output div's scroll height on output text change
      setIsOutputExpanded(outputRef.current.scrollHeight > 160);
    }
  }, [completion]);

  const handleCheck = () => {
    if (!inputText.trim()) {
      // If no text in input show error
      setError("Please enter some text to check.");
      return;
    }
    setError(null);
    // send text to the API for grammar checking
    complete(inputText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Defining a function to handle keydown events on the textarea.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleCopy = () => {
    if (completion) {
      // copy the corrected text to the clipboard
      navigator.clipboard.writeText(completion);
      // handle temporary icon change on copy
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClear = () => {
    // clear input text, completion, and reset the textarea height
    setInputText("");
    setCompletion("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsInputExpanded(false);
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
            <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
              Input Text
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                disabled={!inputText && !completion}
                aria-label="Clear input and output"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`flex flex-col transition-all duration-300 ease-in-out bg-gray-50 ${
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
                // Setting the textarea height based on its scroll height.
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              className={`flex-grow resize-none text-base text-gray-900 border-none shadow-none bg-gray-50 focus:ring-2 focus:ring-blue-500 ${
                isInputExpanded ? "min-h-[10rem]" : ""
              }`}
              aria-label="Input text for grammar checking"
              aria-describedby="input-description"
            />
            <span id="input-description" className="sr-only">
              Enter the text you want to check for grammar and spelling
            </span>
            <Button
              onClick={handleCheck}
              disabled={isLoading}
              className="mt-2 self-start bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? "Checking..." : "Check Grammar"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
              Corrected Text
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!completion}
                  aria-label={
                    isCopied ? "Copied to clipboard" : "Copy to clipboard"
                  }
                >
                  {isCopied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  disabled={!inputText && !completion}
                  aria-label="Clear input and output"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`flex flex-col transition-all duration-300 ease-in-out bg-gray-50 ${
              isOutputExpanded ? "h-auto" : "h-40"
            }`}
          >
            <div
              ref={outputRef}
              className={`flex-grow p-2 rounded-md overflow-auto text-base text-gray-900 bg-gray-50 ${
                isOutputExpanded ? "min-h-[10rem]" : ""
              }`}
              tabIndex={0}
              role="region"
              aria-label="Corrected text output"
            >
              {completion || "Corrected text will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
