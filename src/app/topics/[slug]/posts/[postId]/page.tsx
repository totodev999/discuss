import CommentCreateForm from '@/components/comments/comment-create-form';
import CommentList from '@/components/comments/comment-list';
import PostShow from '@/components/posts/post-show';
import { fetchCommentsByPostId } from '@/db/queries/comment';
import { paths } from '@/path';
import { Skeleton, Spinner } from '@nextui-org/react';
import Link from 'next/link';
import { Suspense } from 'react';

interface PostShowPageProps {
  params: { slug: string; postId: string };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  console.log('PostShowPage');
  const { postId, slug } = params;
  return (
    <div className="space-y-3 mb-14">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {'<'}Back to {slug}
      </Link>
      <Suspense
        fallback={
          <div className="m-4">
            <div className="my-2">
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-4 border rounded space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        }
      >
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} />
      <CommentList fetchData={() => fetchCommentsByPostId(postId)} />
    </div>
  );
}
