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
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  /*
  `aria-live="polite"` tells screen readers that the content of this element may change and should be announced when it does.
  `aria-atomic="true"` ensures that the entire content of the div is read out when it changes, not just the parts that have been updated.
  `aria-relevant="additions text"` specifies that both added content and text changes should be announced.
*/

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
      // making Textarea focused on entering the page
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Adjusting the height of the Textarea and the output div based on the content
    if (inputText || completion) {
      adjustHeight();
    }
  }, [inputText, completion]);

  const adjustHeight = () => {
    // choosing the bigger hight as the default height for both elements, but with minimum height of 150px
    if (textareaRef.current && outputRef.current) {
      const inputHeight = textareaRef.current.scrollHeight;
      const outputHeight = outputRef.current.scrollHeight;
      const maxHeight = Math.max(inputHeight, outputHeight, 150);
      textareaRef.current.style.height = `${maxHeight}px`;
      outputRef.current.style.height = `${maxHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Defining a function to handle keydown events on the textarea.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // send text to the API for grammar checking
      complete(inputText);
      if (outputRef.current) {
        // moving focus to the output div after pressing Enter
        outputRef.current.focus();
        // Add a slight delay to ensure the new content is read - ensures that the new content is available when the label is updated, prompting screen readers to announce the change
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.setAttribute(
              "aria-label",
              "Corrected text output: " + (completion || "")
            );
          }
        }, 100);
      }
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
    setError(null);
    if (textareaRef.current) {
      // making the hight back to the default 150px
      textareaRef.current.style.height = "150px";
      // making the input focused
      textareaRef.current.focus();
    }
    if (outputRef.current) {
      // making the hight back to the default 150px
      outputRef.current.style.height = "150px";
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
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900 h-8">
              <h1>Input Text</h1>
              {inputText && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  aria-label="Clear input"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your text here and press Enter to check grammar..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // making the Textarea height adjust to the content
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              className="w-full h-[150px] min-h-[150px] resize-none !text-base text-gray-900 border-none bg-gray-50 focus:ring-2 focus:ring-blue-500 !font-sans"
              aria-label="Input text for grammar checking"
              aria-describedby="input-description"
            />
            <span id="input-description" className="sr-only">
              Enter the text you want to check for grammar and spelling, then
              press Enter to check
            </span>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900 h-8">
              <h1>Corrected Text</h1>
              {completion && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
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
                    aria-label="Clear input and output"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div
              ref={outputRef}
              className="w-full h-[150px] min-h-[150px] p-2 rounded-md overflow-auto text-base text-gray-900 bg-gray-50 font-sans"
              tabIndex={0}
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="additions text"
              aria-label="Corrected text output"
              aria-describedby="output-description"
            >
              {completion ? completion : "Corrected text will appear here..."}
            </div>
            <span id="output-description" className="sr-only">
              This area displays the corrected version of your input text
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
