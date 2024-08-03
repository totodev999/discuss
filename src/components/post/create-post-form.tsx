'use client';

import { useFormState } from 'react-dom';
import * as actions from '@/actions';
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from '@nextui-org/react';
import FormButton from '../common/form-button';
import { use, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePostFormState } from '@/actions/create-post';
import { unknown } from 'zod';
import { paths } from '@/path';

interface CreatePostFormProps {
  slug: string;
}

export default function PostCreateForm({ slug }: CreatePostFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, action] = useFormState(
    actions.createPost.bind(null, slug),
    { errors: {} }
  );
  useEffect(() => {
    if (!Object.keys(formState.errors).length) {
      setIsOpen(false);
    }
  }, [formState]);

  return (
    <Popover
      placement="left"
      isOpen={isOpen}
      onOpenChange={() => setIsOpen((prev) => !prev)}
    >
      <PopoverTrigger>
        <Button color="primary">Create a Post</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
              isInvalid={!!formState.errors.title}
              errorMessage={formState.errors.title?.join('\n')}
              classNames={{ errorMessage: 'whitespace-pre-wrap' }}
            />
            <Textarea
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
              isInvalid={!!formState.errors.content}
              errorMessage={formState.errors.content?.join('\n')}
              classNames={{ errorMessage: 'whitespace-pre-wrap' }}
            />
            {formState.errors._form && (
              <div className="bg-red-200 border border-red-400">
                {formState.errors._form.join('\n')}
              </div>
            )}
            <FormButton>Create Post</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
