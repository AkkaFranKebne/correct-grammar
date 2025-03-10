import type { StoryblokClient, ISbStoriesParams } from "@storyblok/react";
import Link from "next/link";
import Image from "next/image";
import { getStoryblokApi } from "@/lib/storyblok";
import type { Metadata } from "next";
import { PostPageStoryblok } from "../../../../component-types-sb";

interface StoryblokStory {
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  created_at: string;
  published_at: string | null;
  content: PostPageStoryblok;
}

// Function to fetch all posts from Storyblok
async function fetchPosts() {
  const sbParams: ISbStoriesParams = {
    version: "draft",
    starts_with: "posts/", // This filters stories that start with "posts/"
    is_startpage: false, // Exclude the folder itself
    per_page: 100, // Adjust based on how many posts you expect
  };

  const storyblokApi: StoryblokClient = getStoryblokApi()();
  return storyblokApi.get(`cdn/stories`, sbParams);
}

// Generate metadata for the page
export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Explore our collection",
};

// Generate static params for all post pages
export async function generateStaticParams() {
  try {
    const response = await fetchPosts();

    if (!response || !response.data || !response.data.stories) {
      return [];
    }

    return response.data.stories.map((story: StoryblokStory) => ({
      slug: story.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Posts() {
  const response = await fetchPosts();

  if (!response || !response.data) {
    return <div className="error-msg">No posts found</div>;
  }

  const { stories } = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story: StoryblokStory) => (
          <Link
            href={`/posts/${story.slug}`}
            key={story.uuid}
            className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <article className="flex flex-col h-full">
              {/* Featured Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {story.content.image?.filename ? (
                  <Image
                    src={story.content.image.filename}
                    alt={
                      story.content.image.alt ||
                      story.content.title ||
                      "featured image"
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {story.content.title}
                </h2>

                {/* Date */}
                <time className="text-sm text-muted-foreground mb-3">
                  {new Date(
                    story.published_at || story.created_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>

                <div className="mt-auto">
                  <span className="inline-flex items-center text-primary font-medium">
                    Read more
                    <svg
                      className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found. Create some posts in Storyblok to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
