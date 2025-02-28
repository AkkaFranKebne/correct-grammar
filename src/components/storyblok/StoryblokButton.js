import {
  storyblokEditable
} from "@storyblok/react/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link"

const StoryblokButton = ({ blok }) => {
  return (
  <div {...storyblokEditable(blok)}>
    <Button asChild variant={blok.variant} size={blok.size}>
      <Link href={blok.link.cached_url}>{blok.label}</Link>
    </Button>
  </div>
);
}


export default StoryblokButton; 