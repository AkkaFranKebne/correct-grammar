import { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";

async function fetchData(id: string) {
  let sbParams: ISbStoriesParams = { version: "draft" };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories/posts/${id}`, sbParams);
}

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await fetchData(id);

  if (!data) {
    return <div className="error-msg">Ups</div>;
  }
  console.log("data", data.story.content.text);
  return (
    <div>
      <StoryblokStory story={data.story} />
    </div>
  );
}
