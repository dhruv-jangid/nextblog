"use client";

import StarterKit from "@tiptap/starter-kit";
import { Selection } from "@tiptap/extensions";
import Youtube from "@tiptap/extension-youtube";
import TipTapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";

export const ContentViewer = ({ content }: { content: BlogContent }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    injectCSS: false,
    content,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TipTapImage.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Emoji.configure({ emojis: gitHubEmojis, enableEmoticons: true }),
      Youtube,
      Selection,
      TextStyleKit,
    ],
  });

  if (!editor) {
    return (
      <div className="flex items-center pl-6 gap-1.5 h-16">
        <div className="w-2 h-2 rounded-full bg-accent-foreground animate-[bounce_1s_infinite_0ms]" />
        <div className="w-2 h-2 rounded-full bg-accent-foreground animate-[bounce_1s_infinite_200ms]" />
        <div className="w-2 h-2 rounded-full bg-accent-foreground animate-[bounce_1s_infinite_400ms]" />
      </div>
    );
  }

  return (
    <EditorContent
      editor={editor}
      className="prose prose-slate dark:prose-invert max-w-none bg-transparent text-foreground 
            [&_.ProseMirror]:outline-none [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:h-64
            sm:[&_.ProseMirror_iframe]:h-80 md:[&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:rounded-lg
            [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h1]:tracking-tight
            [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-1.5 [&_.ProseMirror_h2]:tracking-tight
            [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_h3]:tracking-tight
            [&_.ProseMirror_p]:text-xl [&_.ProseMirror_p]:mb-1 [&_.ProseMirror_p]:leading-normal
            [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-2
            [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-2
            [&_.ProseMirror_li]:mb-0 [&_.ProseMirror_li]:leading-normal
            [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto
            [&_.ProseMirror_em]:italic [&_.ProseMirror_hr]:h-px [&_.ProseMirror_hr]:bg-border [&_.ProseMirror_hr]:my-4
            [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0"
    />
  );
};
