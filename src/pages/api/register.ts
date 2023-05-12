/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { createSession } from '~/utils/sessionData';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === "POST") {
        
      const { name, email, password } = req.body;
  
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password, 
          },
        });
        
        const sessionData = await createSession(user);
        res.status(200).json(sessionData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during registration" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }