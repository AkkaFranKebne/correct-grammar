import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import Image from "next/image";

interface PostPageProps {
  blok: any;
}

const PostPage: React.FC<PostPageProps> = ({ blok }) => {
  return (
    <main className="" {...storyblokEditable(blok)}>
      <section>
        <h1>{blok.title}</h1>
        <Image
          width="500"
          height="500"
          src={blok.image.filename}
          alt={blok.image.meta_data.alt}
          placeholder="blur"
          blurDataURL={blok.image.filename} // to do how to get smaller version from storyblok
        />
      </section>
      <section>for content</section>
    </main>
  );
};

export default PostPage;
