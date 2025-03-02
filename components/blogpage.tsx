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
import { TbEdit, TbPhotoUp, TbTrash } from "react-icons/tb";
import { useState, useRef } from "react";
import { useActionState } from "react";
import { deleteBlog, editBlog } from "@/actions/handleBlog";
import blogCategories from "@/utils/blogCategories.json";
import Image from "next/image";
import Link from "next/link";
import { Like } from "@/components/like";
import { RichTextEditor } from "@/components/editor";
import { Comment } from "@/components/comment";

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
      className="prose max-w-none text-balance bg-white/5 p-6 rounded-2xl antialiased [&_.ProseMirror]:outline-none 
          [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_p]:text-xl
          [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_li]:mb-2"
    />
  );
};

export default function BlogPage({
  blog,
  isAuthor,
  isLiked,
  userSlug,
}: {
  blog: {
    title: string;
    slug: string;
    content: string;
    image: string;
    category: string;
    createdAt: Date;
    likes: { userId: string }[];
    comments: {
      id: string;
      content: string;
      createdAt: Date;
      author: { name: string; image: string | null; slug: string };
    }[];
    author: { id: string; name: string; slug: string; image: string | null };
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
  const [deleteError, deleteAction, deleteIsPending] = useActionState(
    deleteBlog,
    null
  );
  const [editError, editAction, editIsPending] = useActionState(editBlog, null);

  const hasChanges = () =>
    title !== blog.title ||
    content !== blog.content ||
    category !== blog.category ||
    image !== null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCancel = () => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setPreviewUrl(null);
    setImage(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:gap-8 lg:px-16 lg:py-10">
      <div className="flex flex-col gap-6">
        {deleteError && (
          <div className="flex bg-red-800 justify-center text-xl font-medium rounded-2xl py-2">
            {deleteError}
          </div>
        )}
        {editError && (
          <div className="flex bg-red-800 justify-center text-xl font-medium rounded-2xl py-2">
            {editError}
          </div>
        )}
        <div className="flex justify-between">
          {isEditing ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={deleteIsPending || editIsPending}
              className="bg-[#EEEEEE] px-3 py-1.5 rounded-xl tracking-tight text-sm xl:text-base text-black cursor-pointer hover:bg-[#E0E0E0] transition-colors"
            >
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <Link href={`/blogs/${category}`}>
              <Button>{category}</Button>
            </Link>
          )}
          {isAuthor &&
            (isEditing ? (
              <div className="flex gap-2 tracking-tight">
                <Button
                  onClick={handleCancel}
                  disabled={editIsPending || deleteIsPending}
                  className="flex items-center gap-1 bg-red-700 text-sm xl:text-base text-white cursor-pointer px-3 py-1.5 rounded-xl hover:bg-red-700/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <form action={editAction}>
                  <input
                    type="hidden"
                    name="slug"
                    id="slug"
                    value={blog.slug}
                  />
                  <input type="hidden" name="title" id="title" value={title} />
                  <input
                    type="hidden"
                    name="content"
                    id="content"
                    value={content}
                  />
                  <input
                    type="hidden"
                    name="category"
                    id="category"
                    value={category}
                  />
                  {image && (
                    <input
                      type="file"
                      name="image"
                      className="hidden"
                      ref={(input) => {
                        if (input) {
                          const dataTransfer = new DataTransfer();
                          dataTransfer.items.add(image);
                          input.files = dataTransfer.files;
                        }
                      }}
                    />
                  )}
                  <Button
                    disabled={editIsPending || deleteIsPending || !hasChanges()}
                  >
                    {editIsPending ? "Saving..." : "Save"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={editIsPending || deleteIsPending}
                  className="flex items-center tracking-tight gap-1.5 bg-[#EEEEEE] text-sm xl:text-base text-[#0F0F0F] cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit <TbEdit />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteIsPending || editIsPending}
                  className="flex items-center gap-1.5 bg-red-700 text-sm xl:text-base text-[#EEEEEE] cursor-pointer px-3 py-1.5 rounded-xl hover:bg-red-700/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TbTrash />
                </button>
              </div>
            ))}
        </div>

        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Title cannot be empty"
            className="text-3xl lg:text-5xl text-balance antialiased rounded-2xl w-4/5 font-semibold bg-[#191919] px-4 py-3 resize-none"
          />
        ) : (
          <h1 className="text-3xl lg:text-5xl text-balance antialiased rounded-lg w-4/5 font-semibold line-clamp-3">
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

      <div className="relative w-full h-[40vh] lg:h-[60vh] rounded-2xl overflow-hidden group max-h-[30rem]">
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
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <TbPhotoUp size={24} />
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
          <div className="bg-[#0F0F0F] p-6 rounded-2xl bg-linear-to-br from-[#191919] from-40% to-transparent max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete?</h2>
            <p className="mb-6">
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteIsPending || editIsPending}
              >
                Cancel
              </Button>
              <form action={deleteAction}>
                <input type="hidden" name="slug" id="slug" value={blog.slug} />
                <button
                  disabled={deleteIsPending || editIsPending}
                  className="bg-red-700 cursor-pointer text-white hover:bg-red-700/80 transition-all duration-300 px-3 py-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteIsPending ? "Deleting..." : "Delete"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
