import React from "react";
import type { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PostPageProps = Promise<{ slug: string }>;

// Function to fetch a single post from Storyblok
async function fetchPost(slug: string) {
  const sbParams: ISbStoriesParams = {
    version: "draft",
  };

  try {
    const storyblokApi: StoryblokClient = getStoryblokApi()();
    return await storyblokApi.get(`cdn/stories/posts/${slug}`, sbParams);
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Generate metadata for the page dynamically
export async function generateMetadata({
  params,
}: {
  params: PostPageProps;
}): Promise<Metadata> {
  const { slug }: { slug: string } = await params;
  const response = await fetchPost(slug);

  if (!response || !response.data || !response.data.story) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const { story } = response.data;

  return {
    title: `${story.content.title} | BlogMaster`,
    description: `Read ${story.content.title} on BlogMaster`,
    openGraph: {
      title: story.content.title,
      description: `Read ${story.content.title} on BlogMaster`,
      images: story.content.image?.filename
        ? [
            {
              url: story.content.image.filename,
              width: 1200,
              height: 630,
              alt: story.content.image.alt || story.content.title,
            },
          ]
        : [],
      type: "article",
      publishedTime: story.published_at || story.created_at,
    },
  };
}

// Generate static params for all post pages
export async function generateStaticParams() {
  const sbParams: ISbStoriesParams = {
    version: "draft",
    starts_with: "posts/",
    is_startpage: false,
    per_page: 100,
  };

  try {
    const storyblokApi: StoryblokClient = getStoryblokApi()();
    const response = await storyblokApi.get(`cdn/stories`, sbParams);

    if (!response || !response.data || !response.data.stories) {
      return [];
    }

    return response.data.stories.map((story: any) => ({
      slug: story.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Post({ params }: { params: PostPageProps }) {
  const { slug }: { slug: string } = await params;
  const response = await fetchPost(slug);

  if (!response || !response.data || !response.data.story) {
    notFound();
  }

  const { story } = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <StoryblokStory story={story} />
    </div>
  );
}
