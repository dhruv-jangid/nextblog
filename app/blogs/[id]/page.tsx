import { query } from "@/app/actions/db";
import Image from "next/image";
import { getCldImageUrl } from "next-cloudinary";

export default async function Blog({ params }: { params: { id: string } }) {
  const { id } = await params;
  const blog = await query(
    "SELECT blogid, title, description, date, category, userid, name FROM users JOIN blogs ON userid = user_id WHERE blogid = $1;",
    [id]
  );
  const imgUrl = getCldImageUrl({
    src: `nextblog/blogs/${blog[0].blogid}_${blog[0].category}_${blog[0].userid}`,
  });

  return (
    <div className="flex flex-col gap-4 px-8">
      <div className="flex justify-center">
        <h1 className="text-3xl bg-[#191919] rounded-lg py-2 px-4">
          {blog[0].title}
        </h1>
      </div>
      <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
        <Image
          src={imgUrl}
          alt={blog[0].title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex justify-end gap-4 text-lg">
        <h2 className="bg-[#191919] rounded-lg py-2 px-4">{blog[0].date}</h2>
        <h2 className="bg-[#191919] rounded-lg py-2 px-4">{blog[0].name}</h2>
      </div>
      <p className="text-xl bg-[#191919] p-4 rounded-lg">
        {blog[0].description}
      </p>
    </div>
  );
}
