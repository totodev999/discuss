'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { paths } from '@/path';
import { Topic } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: 'Must be lowercase letters or dashes without space',
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['You must be logged in to create a topic'] } };
  }

  // difference from safeParse and parse is thoow an error if the data is invalid(parse)
  const validation = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: validation.data.name,
        description: validation.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ['Something went wrong'] } };
    }
  }

  revalidatePath(paths.homePath());
  redirect(paths.topicShow(topic.slug));
}
