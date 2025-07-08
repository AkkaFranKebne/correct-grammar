import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
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

async function fetchData() {
  const sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/sign-in`, sbParams);
}
