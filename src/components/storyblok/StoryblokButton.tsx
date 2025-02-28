import type React from "react";
import type { ButtonStoryblok } from "../../../component-types-sb";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StoryblokButtonProps {
  blok: ButtonStoryblok;
}

const StoryblokButton: React.FC<StoryblokButtonProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      <Button
        asChild
        variant={
          blok.variant as
            | "default"
            | "destructive"
            | "outline"
            | "secondary"
            | "ghost"
            | "link"
        }
        size={blok.size as "default" | "sm" | "lg" | "icon"}
      >
        {blok.link && <Link href={blok.link.cached_url}>{blok.label}</Link>}
      </Button>
    </div>
  );
};

export default StoryblokButton;
