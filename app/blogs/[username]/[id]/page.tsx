import { query } from "@/actions/db";
import Image from "next/image";
import { getCldImageUrl } from "next-cloudinary";

export default async function Blog({
  params,
}: {
  params: { username: string; id: number };
}) {
  const { username, id } = await params;
  const blog = await query(
    "SELECT blogid, title, description, date, category, userid, name FROM users JOIN blogs ON userid = user_id WHERE username = $1 AND blogid = $2;",
    [username, id]
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
      <div className="flex justify-between text-lg">
        <h2 className="bg-[#191919] rounded-lg py-2 px-4">
          {blog[0].category}
        </h2>
        <div className="flex gap-4">
          <h2 className="bg-[#191919] rounded-lg py-2 px-4">{blog[0].date}</h2>
          <h2 className="bg-[#191919] rounded-lg py-2 px-4">{blog[0].name}</h2>
        </div>
      </div>
      <div
        className="text-lg bg-[#191919] p-6 rounded-lg"
        id="blogdesc"
        dangerouslySetInnerHTML={{ __html: blog[0].description }}
      ></div>
    </div>
  );
}
