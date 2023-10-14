import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const records = await prisma.userData.findMany({
        where: {
          isScraped: false,
        },
        take: 1,
        select: {
          id: true,
          personalLinkedinUrl: true,
        },
      })
      res.status(200).json({ message: 'Fetched successfully', records })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Something Went Wrong', error })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
