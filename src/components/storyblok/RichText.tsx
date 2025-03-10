import React from "react";
import { storyblokEditable, renderRichText } from "@storyblok/react";
import "./richText.css";

interface RichTextProps {
  blok: {
    _uid: string;
    text: {
      type: string;
      content: any[];
    };
    component: string;
  };
}

const RichText: React.FC<RichTextProps> = ({ blok }) => {
  // Convert the rich text object to HTML
  const renderedRichText = renderRichText(blok.text);

  if (!renderedRichText) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:text-foreground prose-headings:font-bold 
        prose-h1:text-3xl prose-h1:mt-6 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mt-5 prose-h2:mb-3
        prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-3
        prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-foreground prose-p:my-4 prose-p:leading-relaxed
        prose-a:text-primary prose-a:underline hover:prose-a:opacity-80
        prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:text-muted-foreground
        prose-ul:list-disc prose-ul:pl-6
        prose-ol:list-decimal prose-ol:pl-6
        prose-li:my-2
        prose-img:rounded-md prose-img:my-6
        prose-hr:border-border prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: renderedRichText }}
    />
  );
};

export default RichText;
