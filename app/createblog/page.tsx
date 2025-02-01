"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { useActionState, startTransition } from "react";
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from "react-icons/fa";
import { Button } from "@/components/button";
import { createBlog } from "@/actions/handleBlog";
import blogCategories from "@/lib/blogcategories.json";
import { z } from "zod";
import { TbPhotoUp } from "react-icons/tb";

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip?: string;
}

// Add validation schema
const blogSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title cannot exceed 100 characters"),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .max(10000, "Content cannot exceed 10000 characters"),
  blogCover: z.instanceof(File).refine((file) => {
    return file.size <= 5 * 1024 * 1024; // 5MB limit
  }, "Image size must be less than 5MB"),
  category: z.string().min(1, "Category is required"),
});

// Split validation into separate functions for each field
const validateTitle = (title: string) => {
  try {
    blogSchema.shape.title.parse(title);
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid title";
  }
};

const validateContent = (content: string) => {
  try {
    blogSchema.shape.content.parse(content);
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid content";
  }
};

const validateImage = (file: File | null) => {
  if (!file) return "Cover image is required";
  try {
    blogSchema.shape.blogCover.parse(file);
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid image";
  }
};

const validateCategory = (category: string) => {
  try {
    blogSchema.shape.category.parse(category);
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid category";
  }
};

export default function CreateBlog({
  content = "",
  onChange,
}: {
  content?: string;
  onChange?: (html: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [state, formAction, isPending] = useActionState(createBlog, null);
  const [category, setCategory] = useState("");
  const [blogCover, setBlogCover] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Update handlers to use individual validation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const error = validateTitle(newTitle);
    setValidationErrors((prev) => ({
      ...prev,
      title: error,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    const error = validateCategory(newCategory);
    setValidationErrors((prev) => ({
      ...prev,
      category: error,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBlogCover(file);
    const error = validateImage(file);
    setValidationErrors((prev) => ({
      ...prev,
      blogCover: error,
    }));
  };

  // Update editor configuration
  const editor = useEditor({
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
      Image.configure({
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
        placeholder: "Start writing your amazing blog post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange?.(newContent);
      const error = validateContent(newContent);
      setValidationErrors((prev) => ({
        ...prev,
        content: error,
      }));
    },
  });

  // Update form validation check
  const isFormValid =
    !validationErrors.title &&
    !validationErrors.content &&
    !validationErrors.blogCover &&
    !validationErrors.category &&
    title &&
    category &&
    blogCover &&
    editor?.getHTML();

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

  return (
    <div className="flex flex-col gap-10 px-16 py-12">
      <form action={formAction} className="flex flex-col gap-10">
        {state && <div>{state}</div>}

        <div className="flex flex-col gap-6">
          <div className="flex justify-between">
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="bg-[#EEEEEE] px-3 py-1 rounded-lg text-black cursor-pointer hover:bg-[#E0E0E0] transition-colors"
            >
              <option value="" disabled>
                Select a category
              </option>
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter your blog title (10-100 characters)"
            className="text-3xl rounded-lg w-3/5 font-semibold bg-[#191919] px-4 py-3"
            required
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm">{validationErrors.title}</p>
          )}
        </div>

        <div className="relative w-full h-[60vh] rounded-lg overflow-hidden group">
          <input
            id="blogcover"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {blogCover ? (
            <img
              src={URL.createObjectURL(blogCover)}
              alt="Blog cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <TbPhotoUp size={48} className="mx-auto mb-2" />
                <span>Click to upload cover image</span>
              </div>
            </div>
          )}
          <div
            onClick={() => document.getElementById("blogcover")?.click()}
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2 text-white">
              <TbPhotoUp size={24} />
              <span>{blogCover ? "Change Image" : "Upload Image"}</span>
            </div>
          </div>
          {validationErrors.blogCover && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.blogCover}
            </p>
          )}
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-2">
            <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-300 dark:border-gray-700">
              {[1, 2, 3].map((level) => (
                <MenuButton
                  key={level}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level }).run()
                  }
                  isActive={editor?.isActive("heading", { level })}
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
                <FaBold />
              </MenuButton>
              <MenuButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive("italic")}
                tooltip="Italic"
              >
                <FaItalic />
              </MenuButton>
              <MenuButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive("underline")}
                tooltip="Underline"
              >
                <FaUnderline />
              </MenuButton>
            </div>

            <div className="flex gap-1">
              <MenuButton
                onClick={() => editor?.chain().focus().undo().run()}
                tooltip="Undo"
              >
                <FaUndo />
              </MenuButton>
              <MenuButton
                onClick={() => editor?.chain().focus().redo().run()}
                tooltip="Redo"
              >
                <FaRedo />
              </MenuButton>
            </div>
          </div>

          <EditorContent
            editor={editor}
            className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none bg-[#191919]"
          />
        </div>
        {validationErrors.content && (
          <p className="text-red-500 text-sm">{validationErrors.content}</p>
        )}

        <div className="flex justify-end">
          <Button
            disabled={isPending || !isFormValid}
            onClick={() => {
              if (editor && isFormValid) {
                startTransition(() => {
                  formAction({
                    title,
                    blogCover,
                    content: editor.getHTML(),
                    category,
                  });
                });
              }
            }}
            className="px-6 py-2 text-lg"
          >
            {isPending ? "Posting..." : "Publish Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
}
