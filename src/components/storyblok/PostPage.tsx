import type React from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react/rsc";
import type { PostPageStoryblok } from "../../../component-types-sb";
import Image from "next/image";
import RichText from "./RichText";
import "./postPage.css";

interface PostPageProps {
  blok: PostPageStoryblok & SbBlokData;
}

const PostPage: React.FC<PostPageProps> = ({ blok }) => {
  return (
    <main
      className="container mx-auto px-4 py-8 max-w-7xl"
      {...storyblokEditable(blok)}
    >
      {/* Header section with title and image side by side */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {blok.title}
          </h1>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
          {
            <Image
              src={blok?.image?.filename || ""}
              alt={blok?.image?.meta_data?.alt || blok.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={`${blok?.image?.filename}/m/100x100/filters:blur(10)`}
              priority
            />
          }
        </div>
      </section>

      {/* Rich text content with CSS columns */}
      <section className="rich-text-columns">
        <RichText blok={blok} type="doc" />
      </section>
    </main>
  );
};

export default PostPage;
