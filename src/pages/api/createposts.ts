/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next'
import { authOptions } from "~/server/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

const session: any = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

   const { title, body } = req.body;

  try {
    const author = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!author) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    const createdPost = await prisma.post.create({
      data: {
        title,
        body,
        author: { connect: { id: author.id } },
      },
    });

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
