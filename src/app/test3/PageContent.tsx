"use client";

import { useActionState } from "react";
import { fetchData } from "./actions";
import { StoryblokStory } from "@storyblok/react/rsc";
import { Button } from "@/components/ui/button";

// useActionState is a Hook that allows you to update state based on the result of a form action. It takes an action function and returns an array with the current state, the action function, and a boolean indicating if the action is pending. The action function is called with the form event as an argument. The action function should return a Promise that resolves to the new state.

export default function PageContent() {
  const [state, fetchDataAction, pending] = useActionState(fetchData, null);

  return (
    <>
      {!state && !pending && (
        <div className="h-screen w-full flex justify-center items-center">
          <form action={fetchDataAction}>
            <Button size="lg" type="submit">
              Show Page
            </Button>
          </form>
        </div>
      )}
      {pending && (
        <div className="h-screen w-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      )}

      {state && <StoryblokStory story={state.data.story} />}
    </>
  );
}
