/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import { type NextApiRequest, type NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from "~/server/auth";

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {

// const session: any = await getServerSession(req, res, authOptions)

//   if (!session?.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method Not Allowed' });
//     return;
//   }

//    const { title, body } = req.body;

//   try {
//     const author = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       select: { id: true },
//     });

//     if (!author) {
//       res.status(404).json({ error: "Author not found" });
//       return;
//     }

//     const createdPost = await prisma.post.create({
//       data: {
//         title,
//         body,
//         author: { connect: { id: author.id } },
//       },
//     });

//     res.status(201).json(createdPost);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/server/auth';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: any = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { title, body } = req.body;

  try {
    const cachedPosts = await redis.get(`posts:${session.user.id}`);
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      return res.status(200).json(posts);
    }

    const author = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!author) {
      res.status(404).json({ error: 'Author not found' });
      return;
    }

    const createdPost = await prisma.post.create({
      data: {
        title,
        body,
        author: { connect: { id: author.id } },
      },
    });

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      select: { id: true, title: true, body: true },
    });
    await redis.set(`posts:${session.user.id}`, JSON.stringify(posts));

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
