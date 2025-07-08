import type React from "react";
import type { HeroSectionStoryblok } from "../../../component-types-sb";
import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";

interface HeroSectionProps {
  blok: HeroSectionStoryblok & SbBlokData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ blok }) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className={`${blok.fullWidth} relative h-[66vh] max-h-[800px] flex items-center justify-center bg-opacity-80 bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${blok?.image?.filename})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{blok.headline}</h1>
        <p className="text-lg md:text-xl mb-8">{blok.subheadline}</p>
        {blok.buttons && (
          <div className="flex flex-col flex-wrap justify-center gap-4">
            {blok.buttons.map((nestedBlok) => (
              <StoryblokServerComponent
                blok={nestedBlok}
                key={nestedBlok._uid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
