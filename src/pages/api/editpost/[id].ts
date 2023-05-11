/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
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
//       return res.status(404).json({ error: 'as Post not found' });
//     }

//     return res.status(200).json({ post });
//   } catch (error) {
//     console.log('Error fetching post:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: String(id) },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ post });
    } catch (error) {
      console.log('Error fetching post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { body } = req.body;

    try {
      const updatedPost = await prisma.post.update({
        where: { id: String(id) },
        data: { body },
      });

      return res.status(200).json({ post: updatedPost });
    } catch (error) {
      console.log('Error updating post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
