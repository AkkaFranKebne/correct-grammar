"use client";

import { useState, useRef, type KeyboardEvent, useEffect } from "react";
import { useCompletion } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* 
  Framer Motion Animation Guide:
  
  - motion.div: A div with animation capabilities from Framer Motion
  - variants: Reusable animation objects that define different states (hidden, visible, etc.)
  - AnimatePresence: Handles animations for components that are being added/removed from the DOM
  - initial: The starting state of an animation
  - animate: The target state of an animation
  - exit: The ending state when an element is removed
  - transition: Controls how the animation plays (duration, easing, etc.)
  - whileHover/whileTap: Animations that trigger on user interactions
*/

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

  const handleCheck = () => {
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

  // Animation variants define reusable animation states that can be referenced by name
  // They help organize animations and enable parent-child relationships

  // Container animation - controls the overall component animation and coordinates child animations
  const containerVariants = {
    hidden: { opacity: 0 }, // Initial state - fully transparent
    visible: {
      opacity: 1, // Final state - fully visible
      transition: {
        when: "beforeChildren", // Wait for this animation to complete before starting children
        staggerChildren: 0.2, // Add a 0.2s delay between each child animation for a cascade effect
      },
    },
  };

  // Card animation - slides cards up from below with a spring physics effect
  const cardVariants = {
    hidden: { y: 20, opacity: 0 }, // Start 20px below final position and invisible
    visible: {
      y: 0, // Move to final position
      opacity: 1,
      transition: {
        type: "spring", // Use spring physics for natural motion
        damping: 12, // Lower damping = more bounce
        stiffness: 100, // Higher stiffness = faster animation
      },
    },
  };

  // Alert animation - for error messages that need to appear and disappear smoothly
  const alertVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 }, // Start slightly above, smaller and invisible
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15, // Less bouncy than cards
      },
    },
    exit: {
      // Animation when element is removed from DOM
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }, // Quick fade out
    },
  };

  // Button animation - for interactive elements that respond to user input
  const buttonVariants = {
    hover: { scale: 1.05 }, // Grow slightly on hover
    tap: { scale: 0.95 }, // Shrink slightly when clicked
    copied: {
      // Special animation for copy success feedback
      scale: [1, 1.2, 1], // Array defines keyframes: normal → larger → normal
      transition: { duration: 0.3 },
    },
  };

  // Loading animation - creates a pulsing effect for loading indicators
  const loadingVariants = {
    animate: {
      opacity: [0.5, 1, 0.5], // Keyframes for opacity: dim → bright → dim
      transition: {
        repeat: Number.POSITIVE_INFINITY, // Loop forever
        duration: 1.5, // Complete cycle takes 1.5s
      },
    },
  };

  // Main container with staggered children animation
  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden" // Start with the "hidden" variant
      animate="visible" // Animate to the "visible" variant
    >
      {/* AnimatePresence enables exit animations when components are removed */}
      <AnimatePresence>
        {error && (
          // Error alert with entrance and exit animations
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // This animation plays when the error is cleared
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={cardVariants}>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900 h-8">
                <h1>Input Text</h1>
                {/* AnimatePresence handles the mounting/unmounting of the clear button */}
                <AnimatePresence>
                  {inputText && (
                    // Clear button appears with a scale animation when there's input
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }} // Start invisible and tiny
                      animate={{ opacity: 1, scale: 1 }} // Grow to full size
                      exit={{ opacity: 0, scale: 0 }} // Shrink when removed
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleClear}
                          aria-label="Clear input"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {/* Interactive button with hover and tap animations */}
              <motion.div
                className="mt-2 md:hidden"
                variants={buttonVariants}
                whileHover="hover" // Apply hover variant when mouse is over
                whileTap="tap" // Apply tap variant when clicked
              >
                <Button
                  onClick={handleCheck}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    // Loading animation with pulsing dots
                    <motion.div
                      variants={loadingVariants}
                      animate="animate" // Continuously animate using the defined variant
                      className="flex items-center"
                    >
                      <span className="mr-2">Checking</span>
                      <span className="flex space-x-1">
                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      </span>
                    </motion.div>
                  ) : (
                    "Check Grammar"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900 h-8">
                <h1>Corrected Text</h1>
                {/* AnimatePresence for the action buttons that appear when there's output */}
                <AnimatePresence>
                  {completion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="flex gap-2"
                    >
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        animate={isCopied ? "copied" : ""}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopy}
                          aria-label={
                            isCopied
                              ? "Copied to clipboard"
                              : "Copy to clipboard"
                          }
                        >
                          {/* AnimatePresence with mode="wait" ensures one animation completes before the next starts */}
                          <AnimatePresence mode="wait">
                            {isCopied ? (
                              // Check icon animation when copied
                              <motion.div
                                key="check" // Unique key helps Framer Motion identify which element is which
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </motion.div>
                            ) : (
                              // Copy icon animation
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Copy className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleClear}
                          aria-label="Clear input and output"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Output container with subtle fade-in animation */}
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                className="relative"
              >
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
                  {/* Loading spinner animation with rotation */}
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center h-full text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{
                          rotate: 360, // Rotate a full 360 degrees
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY, // Loop forever
                          duration: 1.5,
                          ease: "linear", // Constant speed rotation
                        }}
                        className="mr-2 w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
                      />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    // AnimatePresence for smooth transition between placeholder and result
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={completion ? "result" : "placeholder"} // Change key to trigger animation when content type changes
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {completion ? (
                          // Result text fades in with a slight delay after loading completes
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: {
                                delay: 0.1, // Small delay for a more polished feel
                                duration: 0.5,
                              },
                            }}
                          >
                            {completion}
                          </motion.div>
                        ) : (
                          "Corrected text will appear here..."
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                <span id="output-description" className="sr-only">
                  This area displays the corrected version of your input text
                </span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
