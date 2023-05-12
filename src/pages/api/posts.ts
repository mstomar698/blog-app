/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { type NextApiRequest, type NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const session = await getSession({ req });
//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const posts = await prisma.post.findMany({
//       where: { authorId: session.user.id },
//       select: { id: true, title: true, body: true },
//     });

//     return res.status(200).json({ posts });
//   } catch (error) {
//     console.log('Error fetching posts:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const cachedPosts = await redis.get(`posts:${session.user.id}`);
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      return res.status(200).json({ posts });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      select: { id: true, title: true, body: true },
    });

    await redis.set(`posts:${session.user.id}`, JSON.stringify(posts));

    return res.status(200).json({ posts });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
