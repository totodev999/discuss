import { db } from '@/db';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const post = await db.post.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
  console.log('GET Fetch', post);

  return NextResponse.json({ post });
}
