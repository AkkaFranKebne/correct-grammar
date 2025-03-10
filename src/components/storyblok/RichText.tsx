import React from "react";
import { storyblokEditable, renderRichText } from "@storyblok/react";

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
  console.log("renderedRichText", renderedRichText);

  if (!renderedRichText) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className="prose max-w-none prose-headings:font-bold prose-p:my-4"
      dangerouslySetInnerHTML={{ __html: renderedRichText }}
    />
  );
};

export default RichText;
