/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cachedPosts = await redis.get('posts');
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      return res.status(200).json({ posts, message: 'we are caching all posts here' });
    }
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, body: true },
    });

    await redis.set('posts', JSON.stringify(posts));
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
