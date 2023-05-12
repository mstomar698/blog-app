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

//   if (req.method === 'GET') {
//     try {
//       const post = await prisma.post.findUnique({
//         where: { id: String(id) },
//       });

//       if (!post) {
//         return res.status(404).json({ error: 'Post not found' });
//       }

//       return res.status(200).json({ post });
//     } catch (error) {
//       console.log('Error fetching post:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else if (req.method === 'PUT') {
//     const { body } = req.body;

//     try {
//       const updatedPost = await prisma.post.update({
//         where: { id: String(id) },
//         data: { body },
//       });

//       return res.status(200).json({ post: updatedPost });
//     } catch (error) {
//       console.log('Error updating post:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      await updateCache()
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
      await updateCache()
      await redis.set(`post:${id}`, JSON.stringify(post));

      return res.status(200).json({ post });
    } catch (error) {
      console.log('Error fetching post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { body } = req.body;

    try {
      await updateCache()
      const updatedPost = await prisma.post.update({
        where: { id: String(id) },
        data: { body },
      });
      await updateCache()
      await redis.del(`post:${id}`);
      await updateCache()
      return res.status(200).json({ post: updatedPost });
    } catch (error) {
      console.log('Error updating post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
