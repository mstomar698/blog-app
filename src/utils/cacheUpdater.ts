import { prisma } from "~/server/db";
import { Redis } from "ioredis";
const redis = new Redis();

export async function updateCache() {
    try {
      const posts = await prisma.post.findMany({
        select: { id: true, title: true, body: true },
      });
  
      await redis.set('posts', JSON.stringify(posts));
      console.log('Cache updated successfully');
    } catch (error) {
      console.log('Error updating cache:', error);
    }
  }