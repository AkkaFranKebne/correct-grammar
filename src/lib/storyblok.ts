import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import Page from "@/components/storyblok/Page";
import Feature from "@/components/storyblok/Feature";
import Grid from "@/components/storyblok/Grid";
import Teaser from "@/components/storyblok/Teaser";
import HeroSection from "@/components/storyblok/HeroSection";
import StoryblokButton from "@/components/storyblok/StoryblokButton";
import PostPage from "@/components/storyblok/PostPage";

export const getStoryblokApi = () => {
  return storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    components: {
      feature: Feature,
      grid: Grid,
      teaser: Teaser,
      page: Page,
      "hero-section": HeroSection,
      button: StoryblokButton,
      "post page": PostPage,
    },
  });
};
