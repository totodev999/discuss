'use server';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import { db } from '@/db';
import { paths } from '@/path';
import { Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createResponseData, createServerActionsWrapper } from './wrapper';

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

const createPostWrapper =
  createServerActionsWrapper<CreatePostFormState>('createPost');

async function createPostBase(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<{
  data?: CreatePostFormState;
  redirect?: () => void;
  status: number;
}> {
  // the function auth can get session. this means if get some info from own server.
  // see the file node_modules/next-auth/lib/index.js in server environment getSession will be called
  const session = await auth();
  if (!session || !session.user) {
    return createResponseData({
      data: {
        errors: { _form: ['You must be logged in to create a post'] },
      },
      status: 401,
    });
  }

  const validation = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validation.success) {
    return createResponseData({
      data: { errors: validation.error.flatten().fieldErrors },
      status: 401,
    });
  }
  let post: Post;
  try {
    const topic = await db.topic.findFirst({
      where: { slug },
    });

    if (!topic) {
      throw new Error('Topic not found');
    }
    post = await db.post.create({
      data: {
        userId: session.user.id,
        title: validation.data.title,
        content: validation.data.content,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      const errMessage = err.message;
      return createResponseData({
        data: { errors: { _form: [errMessage] } },
        status: 400,
      });
    } else {
      return createResponseData({
        data: { errors: { _form: ['Something went wrong'] } },
        status: 400,
      });
    }
  }

  // TODO: revilidate the tipocShowPage
  const finishFunc = () => {
    revalidatePath(paths.homePath());
    // revalidatePath(paths.topicShow(slug));
    redirect(paths.postShowPath(slug, post.id));
  };
  return createResponseData({ redirect: finishFunc, status: 200 });
  // return { errors: {} };
  // if you redirect to topicShowPage, you will hit the error that errors not found
  // Becase redirect is made for redirecting to Another page. So you can not redirect same page
  // I place some codes needed to redirect topicShowPage
}

// At the end of the file, add the following code.Instead of redirect
//   return { errors: {} };

// Add below codes to src/components/post/create-post-form.tsx. To close Popover after successful post creation
// useEffect(() => {
//   if (!Object.keys(formState.errors).length) {
//     setIsOpen(false);
//   }
// }, [formState]);

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  return createPostWrapper(() => createPostBase(slug, formState, formData));
}
