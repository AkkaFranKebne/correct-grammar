"use server";

import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { getStoryblokApi } from "@/lib/storyblok";

// Add 'use server' at the top of an async function body to mark the function as callable by the client. We call these functions Server Functions. Server Functions are executed on the server and the result is sent to the client. This is useful for fetching data from an API, database, or other sources that are not available on the client.

export async function fetchData() {
  const sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/test`, sbParams);
}
