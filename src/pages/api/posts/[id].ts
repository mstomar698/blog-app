import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

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
}
