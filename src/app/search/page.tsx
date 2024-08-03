import PostList from '@/components/posts/post-list';
import { fetchPostsBySearch } from '@/db/queries/post';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: { term: string };
}

export default async function Seach({ searchParams }: SearchPageProps) {
  const { term } = searchParams;
  if (!term) {
    redirect('/');
  }
  const termDecoded = decodeURIComponent(term);

  return (
    <div className="mb-4">
      <div className="mb-4">
        <h3>
          Search Result of{' '}
          <span className="font-bold text-xl text-red-500">{termDecoded}</span>
        </h3>
      </div>
      <PostList fetchPosts={() => fetchPostsBySearch(termDecoded)} />
    </div>
  );
}
