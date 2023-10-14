import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body: {
        id: string
      } = req?.body
      console.log(body)
      if (!body?.id && typeof body?.id !== 'string') {
        throw new Error('No data was send to the server.')
      }
      const record = await prisma.userData.findUnique({
        where: {
          id: body.id,
        },
        select: {
          isScraped: true,
        },
      })
      if (!record) {
        throw new Error('No record found.')
      }
      const result = await prisma.userData.update({
        where: {
          id: body.id,
        },
        data: {
          isScraped: true,
          scrapedAt: new Date(),
        },
      })
      res.status(200).json({ message: 'Updated Successfully!', result })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Something Went Wrong', error })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
