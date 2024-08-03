import type { Post, User, Topic } from '@prisma/client';
import Link from 'next/link';
import { paths } from '@/path';
import { PostWithData } from '@/db/queries/post';

interface PostListProps {
  fetchPosts: () => Promise<PostWithData[]>;
}

// TODO: Get list of posts into this component somehow
export default async function PostList({ fetchPosts }: PostListProps) {
  const posts = await fetchPosts();
  const renderedPosts = posts.map((post) => {
    const topicSlug = post.topic.slug;

    if (!topicSlug) {
      throw new Error('Need a slug to link to a post');
    }

    return (
      <div key={post.id} className="border rounded p-2">
        <Link href={paths.postShowPath(topicSlug, post.id)}>
          <h3 className="text-lg font-bold">{post.title}</h3>
          <div className="flex flex-row gap-8">
            <p className="text-xs text-gray-400">By {post.user.name}</p>
            <p className="text-xs text-gray-400">
              {post._count.comments} comments
            </p>
          </div>
        </Link>
      </div>
    );
  });

  if (!renderedPosts.length) {
    return <div>No posts found</div>;
  }

  return <div className="space-y-2">{renderedPosts}</div>;
}
