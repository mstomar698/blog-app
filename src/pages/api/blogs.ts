import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, body: true },
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
