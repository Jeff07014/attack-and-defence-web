// export default function handler(req, res) {
//   res.status(200).json({ text: 'Hello' });
// }
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const message = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method === 'GET') {
    const messages = await prisma.message.findMany()
    console.log(messages)
    res.status(200).json(messages)
  } else if (req.method === 'POST') {
    if (session) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          message: {
            create: {
              timestamp: req.body.timestamp,
              name: session.user.name,
              content: req.body.content,
              image: req.body.image,
            },
          },
        },
      })
      // Signed in
      console.log(req.body)
      res.status(200).json({ text: 'update success' })
    } else {
      res.status(401)
    }
  }
  res.end()
}

export default message
