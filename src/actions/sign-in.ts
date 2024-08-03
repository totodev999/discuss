'use server';
import * as auth from '@/auth';

export async function singIn() {
  return auth.signIn('github');
}
