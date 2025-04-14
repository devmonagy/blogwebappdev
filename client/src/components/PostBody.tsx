import React from "react";
import DOMPurify from "dompurify";

const PostBody: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div
      className="prose max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
};

export default PostBody;
