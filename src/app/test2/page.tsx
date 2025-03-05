import { Suspense } from "react";
import { StoryblokClient, ISbStoriesParams, ISbResult } from "@storyblok/react";
import { getStoryblokApi } from "@/lib/storyblok";
import PageContent from "./PageContent";

// You can use React's use hook to stream data from the server to client. Start by fetching data in your Server component, and pass the promise to your Client Component as props. The Client component will then use the use hook to get the data from the promise.

async function fetchData() {
  let sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/test`, sbParams);
}

export default function Test() {
  const storyPromise: Promise<ISbResult> = fetchData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent storyPromise={storyPromise} />
    </Suspense>
  );
}
