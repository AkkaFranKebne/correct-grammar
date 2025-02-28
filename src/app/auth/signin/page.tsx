import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";
import SignInPanel from "@/components/SignInPanel";

export default async function SignInPage() {
  const { data } = await fetchData();
  const { headline } = data.story.content.body[0];

  // passing only part of the data  from Storyblock to the component
  return (
    <div>
      <SignInPanel title={headline} />
    </div>
  );
}

export async function fetchData() {
  let sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/sign-in`, sbParams);
}
