import { clsx, type ClassValue } from "clsx"; // utility for constructing className strings conditionally. It takes multiple class values and combines them into a single string.
import { twMerge } from "tailwind-merge"; // utility from tailwind-merge that intelligently merges Tailwind CSS class names, resolving conflicts (e.g., p-2 and p-4).

/*
The function cn accepts a variable number of arguments (...inputs) of type ClassValue[].
It first uses clsx to combine these class values into a single string.
Then, it passes the result to twMerge to handle any Tailwind CSS class conflicts and return the final merged class string.
*/

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
