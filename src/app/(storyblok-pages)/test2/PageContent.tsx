"use client";

import { use } from "react";
import { ISbResult, StoryblokStory } from "@storyblok/react/rsc";

export default function Test({
  storyPromise,
}: {
  storyPromise: Promise<ISbResult>;
}) {
  const { data } = use(storyPromise);

  return <StoryblokStory story={data.story} />;
}
