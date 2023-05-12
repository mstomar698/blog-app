/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { updateCache } from '~/utils/cacheUpdater';

const prisma = new PrismaClient();
const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cachedPosts = await redis.get('posts');
    if (cachedPosts) {
      await updateCache()
      const posts = JSON.parse(cachedPosts);
      return res
        .status(200)
        .json({ posts, message: 'Fetching posts from cache' });
    }

    const posts = await prisma.post.findMany({
      select: { id: true, title: true, body: true },
    });

    await updateCache();
    await redis.set('posts', JSON.stringify(posts));

    prisma.$on<any>('post', async (event: any) => {
      if (event.operation === 'create' || event.operation === 'update') {
        await updateCache();
      }
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
