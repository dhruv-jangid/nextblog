export type BlogType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  createdAt: string;
  likes: {
    userId: string;
    blogId: string;
  }[];
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
};

export type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
    username: string;
  };
};
