import type { Comment } from '@prisma/client';
import { db } from '..';

export type CommentWithAutor = Comment & {
  user: { name: string | null; image: string | null };
};

export async function fetchCommentsByPostId(
  postId: string
): Promise<CommentWithAutor[]> {
  return db.comment.findMany({
    where: { postId },
    include: { user: { select: { name: true, image: true } } },
  });
}
