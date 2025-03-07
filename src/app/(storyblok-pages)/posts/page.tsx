import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";

async function fetchData() {
  let sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/posts`, sbParams);
}

export default async function Test() {
  const { data } = await fetchData();

  if (!data) {
    return <div className="error-msg">Ups</div>;
  }
  console.log("data", data);
  return (
    <div>
      <StoryblokStory story={data.story} />
    </div>
  );
}
