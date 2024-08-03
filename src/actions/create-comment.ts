'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { paths } from '@/path';
import { createResponseData, createServerActionsWrapper } from './wrapper';

const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}

const createPostWrapper =
  createServerActionsWrapper<CreateCommentFormState>('createComment');

export async function createCommentBase(
  { postId, parentId }: { postId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<{
  data?: CreateCommentFormState;
  redirect?: () => void;
  status: number;
}> {
  const result = createCommentSchema.safeParse({
    content: formData.get('content'),
  });

  if (!result.success) {
    return createResponseData({
      data: {
        errors: result.error.flatten().fieldErrors,
      },
      status: 401,
    });
  }

  const session = await auth();
  if (!session || !session.user) {
    return createResponseData({
      data: {
        errors: {
          _form: ['You must sign in to do this.'],
        },
      },
      status: 401,
    });
  }

  try {
    await db.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        parentId: parentId,
        userId: session.user.id,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return createResponseData({
        data: {
          errors: {
            _form: [err.message],
          },
        },
        status: 500,
        error: err,
      });
    } else {
      return createResponseData({
        data: {
          errors: {
            _form: ['Something went wrong...'],
          },
        },
        status: 500,
      });
    }
  }

  const topic = await db.topic.findFirst({
    where: { posts: { some: { id: postId } } },
  });

  if (!topic) {
    return createResponseData({
      data: {
        errors: {
          _form: ['Failed to revalidate topic'],
        },
      },
      status: 500,
    });
  }

  return createResponseData({
    data: {
      errors: {},
      success: true,
    },
    redirect: () => revalidatePath(paths.postShowPath(topic.slug, postId)),
    status: 200,
  });
}

export async function createComment(
  { postId, parentId }: { postId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  return createPostWrapper(() =>
    createCommentBase({ postId, parentId }, formState, formData)
  );
}
