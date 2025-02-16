export type Blog = {
  title: string;
  slug: string;
  image: string;
  category: string;
  createdAt: Date;
  likes: {
    blogId: string;
    userId: string;
  }[];
  author: {
    id: string;
    slug: string;
    image: string | null;
    name: string;
  };
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    image: string | null;
    slug: string;
  };
};
