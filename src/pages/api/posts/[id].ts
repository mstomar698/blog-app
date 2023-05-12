/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { type NextApiRequest, type NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { id } = req.query;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id: String(id) },
//     });

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     return res.status(200).json({ post });
//   } catch (error) {
//     console.log('Error fetching post:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const cachedPost = await redis.get(`post:${id}`);
    if (cachedPost) {
      const post = JSON.parse(cachedPost);
      return res.status(200).json({ post });
    }

    const post = await prisma.post.findUnique({
      where: { id: String(id) },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await redis.set(`post:${id}`, JSON.stringify(post));

    return res.status(200).json({ post });
  } catch (error) {
    console.log('Error fetching post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}