"use client";

import { Button } from "@/components/button";
import { Author } from "@/components/author";
import { CloudImage } from "@/components/cloudimage";
import { TbEdit, TbPhotoUp, TbTrash } from "react-icons/tb";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { deleteBlog, editBlog } from "@/actions/handleBlog";
import blogCategories from "@/lib/blogcategories.json";
import Image from "next/image";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading, { Level } from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import TiptapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from "react-icons/fa";
import { Like } from "@/components/like";
import { Blog, User, Like as PrismaLike } from "@prisma/client";

export default function BlogPage({
  blog,
  isAuthor,
  isLiked,
}: {
  blog: Blog & {
    author: Pick<User, "id" | "name" | "slug">;
    likes: PrismaLike[];
  };
  isAuthor: boolean;
  isLiked: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [category, setCategory] = useState(blog.category);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hasChanges =
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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", blog.id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    await editBlog(formData);
    setIsEditing(false);
    setImage(null);
    setPreviewUrl(null);
    router.refresh();
  };

  const handleCancel = () => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setImage(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteBlog(blog.id);
    router.refresh();
  };

  const MenuButton = ({
    onClick,
    isActive = false,
    children,
    tooltip,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    tooltip: string;
  }) => (
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
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
    ],
    content: blog.content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:gap-8 lg:px-16 lg:py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          {isEditing ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#EEEEEE] px-3 py-1.5 rounded-xl text-sm xl:text-base text-black cursor-pointer hover:bg-[#E0E0E0] transition-colors"
            >
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <Link
              href={`/blogs/${category}`}
              className="text-sm xl:text-base w-max"
            >
              <Button>{category}</Button>
            </Link>
          )}
          {isAuthor &&
            (isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  className="flex items-center gap-1 bg-red-600 text-sm xl:text-base text-white cursor-pointer px-3 rounded-xl hover:bg-red-600/80 transition-all duration-300"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={!hasChanges}
                  className={`flex items-center gap-1 text-sm xl:text-base ${
                    hasChanges
                      ? "bg-[#EEEEEE] text-black cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  } px-3 rounded-xl`}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-[#EEEEEE] text-sm xl:text-base text-black cursor-pointer px-3 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300"
                >
                  Edit
                  <TbEdit />
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 bg-red-600 text-sm xl:text-base text-[#EEEEEE] cursor-pointer px-3 rounded-xl hover:bg-red-600/80 transition-all duration-300"
                >
                  <TbTrash />
                </Button>
              </div>
            ))}
        </div>

        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={40}
            maxLength={80}
            placeholder="Title cannot be empty"
            className="text-xl lg:text-3xl rounded-lg w-3/4 lg:w-3/5 font-semibold bg-[#191919] px-4 py-3 resize-none"
          />
        ) : (
          <h1 className="text-2xl lg:text-3xl rounded-lg w-3/4 lg:w-3/5 font-semibold">
            {title}
          </h1>
        )}
        {!isEditing && (
          <Author
            date={blog.createdAt.toISOString()}
            slug={blog.author.slug}
            publicId={blog.author.id}
            name={blog.author.name}
          />
        )}
      </div>
      <div className="relative w-full h-[40vh] lg:h-[60vh] rounded-2xl overflow-hidden group max-h-[30rem]">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={title}
            fill={true}
            className="object-cover"
          />
        ) : (
          <CloudImage
            publicId={blog.id}
            alt={blog.title}
            fill={true}
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
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-2">
            <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-300 dark:border-gray-700">
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
                  isActive={editor?.isActive("heading", { level })}
                  tooltip={`Heading ${level}`}
                >
                  H{level}
                </MenuButton>
              ))}
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
              <MenuButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive("bold") || false}
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
            className="prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-hidden bg-[#191919]"
          />
        </div>
      ) : (
        <div
          className="text-lg rounded-lg"
          id="blogdesc"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
      <Like blogId={blog.id} likes={blog.likes.length} isLiked={isLiked} />

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
                className="bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300 transition-all duration-300 px-4 py-2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-600 cursor-pointer text-white hover:bg-red-600/80 transition-all duration-300 px-4 py-2 rounded-xl"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
