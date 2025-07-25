"use client";

import {
  List,
  Link2,
  Undo2,
  Redo2,
  Baseline,
  ImagePlus,
  MoveHorizontal,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
} from "lucide-react";
import {
  Gapcursor,
  Selection,
  Dropcursor,
  Placeholder,
  TrailingNode,
  CharacterCount,
} from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { BubbleMenu } from "@tiptap/react/menus";
import TipTapImage from "@tiptap/extension-image";
import { useToast } from "@/context/toastProvider";
import { BulletList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { useEditor, JSONContent, EditorContent } from "@tiptap/react";

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing your blog...",
  readOnly = true,
}: {
  content?: JSONContent;
  onChange?: (json: JSONContent) => void;
  placeholder?: string;
  readOnly?: boolean;
}) => {
  const { error: errorToast } = useToast();

  const editor = useEditor({
    editable: !readOnly,
    immediatelyRender: false,
    enableContentCheck: true,
    injectCSS: false,
    content,
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        const doc = editor.state.doc;
        const tr = editor.state.tr;
        let hasChanges = false;

        doc.descendants((node, pos) => {
          if (node.type.name === "image" && node.attrs.src) {
            const src = node.attrs.src;
            const isBase64 = src.startsWith("data:");
            const isCloudinary =
              src.includes("cloudinary.com") ||
              src.includes("res.cloudinary.com");

            if (!isBase64 && !isCloudinary) {
              tr.delete(pos, pos + node.nodeSize);
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          editor.view.dispatch(tr);
        } else {
          onChange?.(editor.getJSON());
        }
      }
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TipTapImage.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: 50000 }),
      Emoji.configure({ emojis: gitHubEmojis, enableEmoticons: true }),
      Youtube,
      Gapcursor,
      Selection,
      BulletList,
      Dropcursor,
      TextStyleKit,
      TrailingNode,
      HorizontalRule,
    ],
  });

  if (!editor) {
    return (
      <div className="relative min-h-[60dvh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  editor.on("contentError", ({ error }) => {
    errorToast({ title: error.message });
  });

  return (
    <div className="relative min-h-[60dvh]">
      {!readOnly && (
        <BubbleMenu
          editor={editor}
          options={{ offset: 10, placement: "top" }}
          className="flex overflow-hidden bg-accent border border-r-0 shadow-lg"
        >
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={BoldIcon}
            tooltip="Bold"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={ItalicIcon}
            tooltip="Italic"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            tooltip="Underline"
          />
        </BubbleMenu>
      )}

      {!readOnly && (
        <div className="sticky top-17.5 overflow-hidden border-b backdrop-blur-3xl">
          <div className="flex border-b">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              icon={Undo2}
              tooltip="Undo"
            />
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              icon={Redo2}
              tooltip="Redo"
            />
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 })
                    .run()
                }
                className={`px-4 py-2.5 border-r cursor-pointer transition-all duration-200 ${
                  editor.isActive("heading", { level }) &&
                  "bg-accent-foreground text-accent"
                }`}
              >
                H{level}
              </button>
            ))}
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={BoldIcon}
              tooltip="Bold"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={ItalicIcon}
              tooltip="Italic"
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={UnderlineIcon}
              tooltip="Underline"
            />
          </div>
          <div className="flex">
            <label className="cursor-pointer flex items-center px-3.5 py-3 border-r hover:bg-accent/50 transition-colors">
              <ImagePlus size={18} strokeWidth={1.5} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const result = e.target?.result;
                    if (typeof result === "string") {
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: result, alt: file.name })
                        .run();
                    }
                  };
                  reader.readAsDataURL(file);

                  e.target.value = "";
                }}
              />
            </label>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={List}
              tooltip="Bullet List"
            />
            <MenuButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              icon={MoveHorizontal}
              tooltip="Horizontal Line"
            />
            <MenuButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setColor("oklch(63.7% 0.237 25.331)")
                  .run()
              }
              icon={Baseline}
              tooltip="Red Text"
              iconClasses="stroke-red-500"
            />
            <MenuButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setColor("oklch(62.3% 0.214 259.815)")
                  .run()
              }
              icon={Baseline}
              tooltip="Blue Text"
              iconClasses="stroke-blue-500"
            />
            <MenuButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setColor("oklch(72.3% 0.219 149.579)")
                  .run()
              }
              icon={Baseline}
              tooltip="Green Text"
              iconClasses="stroke-green-500"
            />
            <MenuButton
              onClick={() => {
                const url = prompt("Enter YouTube URL");

                if (url) {
                  editor.commands.setYoutubeVideo({
                    src: url,
                    width: Math.max(320, parseInt("640", 10)) || 640,
                    height: Math.max(180, parseInt("480", 10)) || 480,
                  });
                }
              }}
              icon={Link2}
              tooltip="Youtube Video"
            />
          </div>
        </div>
      )}

      <EditorContent
        editor={editor}
        className={`prose prose-slate dark:prose-invert max-w-none ${
          readOnly ? "" : "p-4 min-h-[300px]"
        } bg-background text-foreground 
        [&_.ProseMirror]:outline-none
        [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-2
        [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-1.5
        [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mb-1
        [&_.ProseMirror_p]:text-xl [&_.ProseMirror_p]:mb-1 [&_.ProseMirror_p]:leading-normal
        [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-2
        [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-2
        [&_.ProseMirror_li]:mb-0 [&_.ProseMirror_li]:leading-normal
        [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto
        [&_.ProseMirror_em]:italic [&_.ProseMirror_hr]:h-px [&_.ProseMirror_hr]:bg-border [&_.ProseMirror_hr]:my-4
        [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0`}
      />
    </div>
  );
};

const MenuButton = ({
  onClick,
  isActive,
  icon: Icon,
  tooltip,
  disabled = false,
  iconClasses,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ElementType;
  tooltip?: string;
  disabled?: boolean;
  iconClasses?: string;
}) => (
  <button
    onClick={onClick}
    type="button"
    title={tooltip}
    disabled={disabled}
    className={`px-3.5 py-3 border-r cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive && "bg-accent-foreground text-accent"
    }`}
  >
    <Icon size={16} className={`${iconClasses}`} />
  </button>
);
