'use client';

import { useFormState } from 'react-dom';
import * as actions from '@/actions';
import { Input } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function HeaderInput() {
  const [state, action] = useFormState(actions.searchPost, { errors: {} });
  const ref = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // When redirected, client components won't rerender, so force this component rerender to reset the form
  const [stateForUpadate, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    if (!state) {
      inputRef.current?.blur();
      ref.current?.reset();
    }
  }, [state, stateForUpadate]);

  return (
    <form
      action={(formData: FormData) => {
        action(formData);
        forceUpdate();
      }}
      ref={ref}
    >
      <Input
        name="term"
        errorMessage={state && state.errors.term?.[0]}
        ref={inputRef}
      />
    </form>
  );
}
