"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import TipTapLink from "@tiptap/extension-link";
import TipTapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/button";
import { Author } from "@/components/author";
import { PencilLine, ImageUp, Trash2, CheckCheck, X } from "lucide-react";
import { useState, useRef } from "react";
import { deleteBlog, editBlog } from "@/actions/handleBlog";
import blogCategories from "@/utils/blogCategories.json";
import Image from "next/image";
import Link from "next/link";
import { Like } from "@/components/like";
import { RichTextEditor } from "@/components/editor";
import { Comment } from "@/components/comment";
import type {
  Blog,
  Comment as CommentType,
  Like as LikeType,
  User,
} from "@prisma/client";

const ReadOnlyContent = ({ content }: { content: string }) => {
  const editor = useEditor({
    immediatelyRender: false,
    content,
    editable: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      History,
      Heading.configure({ levels: [1, 2, 3] }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline" },
      }),
      TipTapImage.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
        allowBase64: true,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TextStyle,
      CharacterCount,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
  });

  return (
    <EditorContent
      editor={editor}
      className="prose max-w-none p-2 text-balance tracking-normal [&_.ProseMirror]:outline-none
        [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_p]:text-lg
        [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:mb-2
        [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:mb-4
        [&_.ProseMirror_li]:mb-2"
    />
  );
};

export default function BlogPage({
  blog,
  isAuthor,
  isLiked,
  userSlug,
}: {
  blog: Omit<Blog, "id" | "authorId" | "updatedAt"> & {
    likes: Pick<LikeType, "userId">[];
    author: Pick<User, "id" | "name" | "slug" | "image">;
    comments: (Omit<CommentType, "updatedAt" | "blogId" | "authorId"> & {
      author: Pick<User, "name" | "image" | "slug">;
    })[];
  };
  isAuthor: boolean;
  isLiked: boolean;
  userSlug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [category, setCategory] = useState(blog.category);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 p-4 lg:gap-8 lg:px-16 lg:py-10">
      <div className="flex flex-col gap-6">
        {error && (
          <div className="flex bg-red-800 justify-center text-xl font-medium rounded-2xl py-2">
            {error}
          </div>
        )}
        <div className="flex justify-between">
          {isEditing ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="bg-rose-300 text-neutral-950 px-3.5 py-1.5 leading-tight rounded-4xl focus:outline-none tracking-tight max-w-2/5 cursor-pointer hover:bg-neutral-800 hover:text-rose-300 transition-colors"
            >
              {blogCategories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-neutral-800 text-neutral-200"
                >
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <Link href={`/blogs/${category}`}>
              <Button roseVariant>{category}</Button>
            </Link>
          )}
          {isAuthor &&
            (isEditing ? (
              <div className="flex gap-2 tracking-tight">
                <Button
                  onClick={() => {
                    setTitle(blog.title);
                    setContent(blog.content);
                    setCategory(blog.category);
                    setPreviewUrl(null);
                    setImage(null);
                    setError(null);
                    setIsEditing(false);
                  }}
                  disabled={isPending}
                >
                  Cancel
                  <X size={16} />
                </Button>
                <Button
                  onClick={async () => {
                    setIsPending(true);
                    const error = await editBlog(
                      blog.slug,
                      title,
                      content,
                      category,
                      image && image
                    );
                    if (error) {
                      setError(error);
                    }
                    setIsPending(false);
                    if (!error) setIsEditing(false);
                  }}
                  disabled={
                    isPending ||
                    content.length < 100 ||
                    (title === blog.title &&
                      content === blog.content &&
                      category === blog.category &&
                      !image)
                  }
                >
                  {isPending ? "Saving..." : "Save"}
                  <CheckCheck size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)}>
                  Edit <PencilLine size={16} />
                </Button>
                <Button onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
        </div>

        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Title cannot be empty"
            className="text-xl md:text-3xl lg:text-5xl text-balance rounded-4xl w-4/5 font-semibold ring ring-neutral-800 px-6 py-5 resize-none focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl lg:text-5xl text-balance rounded-lg w-4/5 font-semibold line-clamp-3">
            {title}
          </h1>
        )}
        {!isEditing && (
          <Author
            date={blog.createdAt}
            slug={blog.author.slug}
            image={blog.author.image}
            name={blog.author.name}
          />
        )}
      </div>

      <div className="relative w-full h-[40vh] lg:h-[60vh] rounded-4xl overflow-hidden group max-h-[30rem]">
        {previewUrl ? (
          <Image src={previewUrl} alt={title} fill className="object-cover" />
        ) : (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority={false}
            placeholder="empty"
            quality={90}
            className="object-cover"
          />
        )}
        {isEditing && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  const url = URL.createObjectURL(file);
                  setPreviewUrl(url);
                }
              }}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ImageUp size={24} />
                <span>Change Image</span>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditing ? (
        <RichTextEditor
          content={content}
          onChange={(html: string) => setContent(html)}
        />
      ) : (
        <ReadOnlyContent content={content} />
      )}

      {!isEditing && (
        <>
          <Like
            blogSlug={blog.slug}
            likes={blog.likes.length}
            isLiked={isLiked}
          />
          <Comment
            isAuthor={isAuthor}
            blogSlug={blog.slug}
            comments={blog.comments}
            userSlug={userSlug}
          />
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 py-5 px-6 rounded-4xl max-w-sm w-full mx-auto">
            <h2 className="text-xl font-semibold mb-1 text-red-700">
              Confirm Delete?
            </h2>
            <p className="mb-8 leading-tight">
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
              >
                Cancel
                <X size={16} />
              </Button>
              <Button
                onClick={async () => {
                  setIsPending(true);
                  await deleteBlog(blog.slug);
                  setIsPending(false);
                }}
                disabled={isPending}
                roseVariant
              >
                {isPending ? "Deleting..." : "Delete"}
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
