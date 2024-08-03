'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

export interface SearchFormState {
  errors: {
    term?: string[];
  };
  success?: boolean;
}

const searchPostObject = z.object({
  term: z.string().min(3),
});

export async function searchPost(
  fromState: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = searchPostObject.safeParse({
    term: formData.get('term'),
  });

  if (!term.success) {
    return { errors: term.error.flatten().fieldErrors, success: false };
  }

  const param = encodeURIComponent(term.data.term);

  // Without rediret to /search, server conponents never rerender, so search won't work
  redirect(`/search?term=${param}`);
}
