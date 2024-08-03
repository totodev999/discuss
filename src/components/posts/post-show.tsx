import { db } from '@/db';
import { notFound } from 'next/navigation';

interface PostShowProps {
  postId: string;
}

export default async function PostShow({ postId }: PostShowProps) {
  const getPost = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('getPost');
    return await db.post.findFirst({ where: { id: postId } });
  };
  const post = await getPost();
  if (!post) {
    notFound();
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
