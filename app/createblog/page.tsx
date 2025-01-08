"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBlog } from "./createBlog";

export default function CreateBlog() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    // 1. Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imageData = await res.json();

      // 2. Create blog post with server action
      const formDataForDB = new FormData(e.target as HTMLFormElement);
      formDataForDB.append("imageUrl", imageData.secure_url);
      const blogId = await createBlog(formDataForDB);

      // 3. Redirect to the new blog post
      router.push(`/blog/${blogId}`);
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8 h-[80vh] text-lg">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="title" className="font-medium">
            Title
          </label>
          <input
            type="text"
            className="w-full py-1.5 px-3 border bg-neutral-900 border-neutral-700 rounded-md focus:outline-none"
            name="title"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="content" className="font-medium">
            Content
          </label>
          <textarea
            name="content"
            className="w-full h-96 py-1.5 px-3 border bg-neutral-900 border-neutral-700 text-neutral-200 rounded-md focus:outline-none resize-none"
            required
          />
        </div>
        <input
          type="file"
          accept="image/*"
          className="w-fit"
          required
          onChange={handleImageChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create Blog
        </button>
        {image && (
          <Image
            src={image}
            alt="Blog's Image"
            width={500}
            height={500}
            priority={false}
            className="mx-auto rounded-2xl"
          />
        )}
      </div>
    </form>
  );
}
