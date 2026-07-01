export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImage: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
    email?: string;
  } | null;
  likesCount: number;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postId: string;
  parentCommentId: string | null;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
  replies?: Comment[]; // For tree structure building
}

export interface CategoryStats {
  name: string;
  count: number;
}

export interface TagStats {
  name: string;
  count: number;
}

export interface AdminStats {
  summary: {
    posts: number;
    users: number;
    comments: number;
    likes: number;
  };
  popularCategories: {
    name: string;
    likes: number;
  }[];
  authorsStats: {
    name: string;
    posts: number;
  }[];
}
