"use client";

import { fetchData } from "./actions";
import { useState } from "react";
import { StoryblokStory } from "@storyblok/react/rsc";

export default function PageContent() {
  const [story, setStory] = useState();

  return (
    <>
      {!story && (
        <button
          onClick={async () => {
            const { data } = await fetchData();
            setStory(data.story);
          }}
        >
          Show Page
        </button>
      )}
      {story && <StoryblokStory story={story} />}
    </>
  );
}
