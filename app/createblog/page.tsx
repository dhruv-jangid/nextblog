"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { createBlog } from "@/actions/handleBlog";
import blogCategories from "@/utils/blogCategories.json";
import { z } from "zod";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import { RichTextEditor } from "@/components/editor";

const blogSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(80, "Title cannot exceed 80 characters"),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .max(3500, "Content cannot exceed 3500 characters"),
  blogCover: z.instanceof(File).refine((file) => {
    return file.size <= 5 * 1024 * 1024;
  }, "Image size must be less than 5MB"),
  category: z.string().min(1, "Category is required"),
});

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

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [error, action, isPending] = useActionState(createBlog, null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [blogCover, setBlogCover] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const isFormValid =
    !validationErrors.title &&
    !validationErrors.content &&
    !validationErrors.blogCover &&
    !validationErrors.category &&
    title &&
    category &&
    blogCover &&
    content;

  return (
    <div className="flex flex-col gap-10 px-4 lg:px-16 py-4 lg:py-12 tracking-tight">
      <div className="flex flex-col gap-4 lg:gap-10">
        <div className="flex flex-col gap-2 lg:gap-6">
          <div className="flex justify-between">
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="bg-[#EEEEEE] text-sm lg:text-lg px-3 py-1.5 rounded-xl text-black cursor-pointer hover:bg-[#E0E0E0] transition-colors"
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

          <textarea
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter your blog title (10-100 characters)"
            className="md:text-3xl lg:text-5xl rounded-2xl w-full font-semibold bg-[#191919] px-4 py-3 resize-none"
            required
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm">{validationErrors.title}</p>
          )}
        </div>

        <div className="relative w-full h-[30vh] xl:h-[60vh] rounded-2xl overflow-hidden group">
          <input
            id="blogcover"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {blogCover ? (
            <Image
              src={URL.createObjectURL(blogCover)}
              alt="Blog cover preview"
              className="object-cover"
              fill={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <ImageUp size={48} className="mx-auto mb-2" />
                <span>Click to upload cover image</span>
              </div>
            </div>
          )}
          <div
            onClick={() => document.getElementById("blogcover")?.click()}
            className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2 text-white">
              <ImageUp size={24} />
              <span>{blogCover ? "Change Image" : "Upload Image"}</span>
            </div>
          </div>
          {validationErrors.blogCover && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.blogCover}
            </p>
          )}
        </div>

        <RichTextEditor
          content={content}
          onChange={(html: string) => {
            setContent(html);
            const error = validateContent(html);
            setValidationErrors((prev) => ({
              ...prev,
              content: error,
            }));
          }}
        />
        {validationErrors.content && (
          <p className="text-red-500 text-sm">{validationErrors.content}</p>
        )}
        {error?.toString() && (
          <div className="text-xl bg-red-800 py-2 font-medium tracking-tight text-center rounded-2xl">
            {error}
          </div>
        )}

        <form action={action} className="flex justify-end text-lg">
          <input type="hidden" name="title" id="title" value={title} />
          <input type="hidden" name="content" id="content" value={content} />
          <input type="hidden" name="category" id="category" value={category} />
          {blogCover && (
            <input
              type="file"
              name="image"
              className="hidden"
              ref={(input) => {
                if (input) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(blogCover);
                  input.files = dataTransfer.files;
                }
              }}
            />
          )}
          <Button disabled={isPending || !isFormValid}>
            {isPending ? "Publishing..." : "Publish"}
          </Button>
        </form>
      </div>
    </div>
  );
}
