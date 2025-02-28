"use client";
import type React from "react";

import { getStoryblokApi } from "@/lib/storyblok";

export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  getStoryblokApi();
  return children;
}
