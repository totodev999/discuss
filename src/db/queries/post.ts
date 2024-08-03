import type { Post } from '@prisma/client';
import { db } from '..';

export type PostWithData = Post & {
  user: {
    name: string | null;
  };
  topic: {
    slug: string;
  };
  _count: {
    comments: number;
  };
};

export async function fetchPostsByTopicSlug(
  slug: string
): Promise<PostWithData[]> {
  console.log('fetchPostsByTopicSlug');
  return db.post.findMany({
    where: {
      topic: {
        slug,
      },
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function fetchPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

// Intentinally imported from client component.
// As a result, this function will be included in the bundle. But it's implemented in Browser.
export async function leakEnv(): Promise<string> {
  console.log('leakEnv');
  return process.env.GITHUB_CLIENT_ID || '';
}

export async function fetchTopPosts(): Promise<PostWithData[]> {
  console.log('fetchTopPosts');
  return db.post.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function fetchPostsBySearch(term: string) {
  return db.post.findMany({
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
    where: {
      OR: [{ title: { contains: term } }, { content: { contains: term } }],
    },
  });
}
