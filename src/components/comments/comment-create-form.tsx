'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Textarea, Button } from '@nextui-org/react';
import FormButton from '@/components/common/form-button';
import * as actions from '@/actions';
import { useRouter } from 'next/navigation';

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
}

export default function CommentCreateForm({
  postId,
  parentId,
  startOpen,
}: CommentCreateFormProps) {
  const [open, setOpen] = useState(startOpen);
  const ref = useRef<HTMLFormElement | null>(null);
  const [formState, action] = useFormState(
    actions.createComment.bind(null, { postId, parentId }),
    { errors: {} }
  );
  console.log('CommentCreateFormformState', formState);
  const router = useRouter();
  const error = formState ? formState.errors : {};

  useEffect(() => {
    if (formState.success) {
      // router.refresh();
      setOpen(false);
    }
  }, [formState, router]);

  const form = (
    <form action={action} ref={ref}>
      <div className="space-y-2 px-1">
        <Textarea
          name="content"
          label="Reply"
          placeholder="Enter your comment"
          isInvalid={!!error.content}
          errorMessage={error.content?.join(', ')}
        />

        {error._form ? (
          <div className="p-2 bg-red-200 border rounded border-red-400">
            {error._form?.join(', ')}
          </div>
        ) : null}

        <FormButton>Create Comment</FormButton>
      </div>
    </form>
  );

  return (
    <div>
      <Button
        size="sm"
        variant="light"
        type="button"
        onPress={() => setOpen(!open)}
      >
        Reply
      </Button>
      {open && form}
    </div>
  );
}
