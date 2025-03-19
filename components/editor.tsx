"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading, { Level } from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import TipTapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Undo,
  Redo,
} from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip?: string;
}

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

const MenuButton = ({
  onClick,
  isActive = false,
  children,
  tooltip,
}: MenuButtonProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
      isActive ? "bg-gray-200 dark:bg-gray-700" : ""
    }`}
    type="button"
    title={tooltip}
  >
    {children}
  </button>
);

export const RichTextEditor = ({
  content = "",
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      History,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      CharacterCount,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-1 py-1.5 px-3 border-b border-gray-300 dark:border-gray-700">
          {[1, 2, 3].map((level) => (
            <MenuButton
              key={level}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: level as Level })
                  .run()
              }
              isActive={editor?.isActive("heading", { level: level as Level })}
              tooltip={`Heading ${level}`}
            >
              H{level}
            </MenuButton>
          ))}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
          <MenuButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            tooltip="Bold"
          >
            <BoldIcon size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            tooltip="Italic"
          >
            <ItalicIcon size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            isActive={editor?.isActive("underline")}
            tooltip="Underline"
          >
            <UnderlineIcon size={18} />
          </MenuButton>
        </div>

        <div className="flex gap-1 px-3 py-2">
          <MenuButton
            onClick={() => editor?.chain().focus().undo().run()}
            tooltip="Undo"
          >
            <Undo size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor?.chain().focus().redo().run()}
            tooltip="Redo"
          >
            <Redo size={18} />
          </MenuButton>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 text-balance tracking-normal min-h-[300px] bg-[#191919] [&_.ProseMirror]:outline-none 
        [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_p]:text-xl
        [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:mb-2
        [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:mb-4
        [&_.ProseMirror_li]:mb-2"
      />
    </div>
  );
};
