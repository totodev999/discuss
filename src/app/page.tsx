import { Button, Divider } from '@nextui-org/react';
import { auth } from '@/auth';
import TopicCreateForm from '@/components/topics/topic-create-form';
import TopicList from '@/components/topics/topic-list';
import PostList from '@/components/posts/post-list';

import { fetchTopPosts } from '@/db/queries/post';

export default async function Home() {
  const posts = await (await fetch('http://localhost:3000/api/data')).json();
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-xl m-2">Top Posts</h1>
        <PostList fetchPosts={() => fetchTopPosts()} />
      </div>
      <div className="border shadow py-3 px-2">
        <TopicCreateForm />
        <Divider className="my-2" />
        <h3 className="text-xl">Topics</h3>
        <TopicList />
      </div>
    </div>
  );
}
