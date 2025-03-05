import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";

export default async function Test() {
  const { data } = await fetchData();

  return (
    <div>
      <StoryblokStory story={data.story} />
    </div>
  );
}

async function fetchData() {
  let sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/test`, sbParams);
}
