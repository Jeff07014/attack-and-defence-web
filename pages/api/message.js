// export default function handler(req, res) {
//   res.status(200).json({ text: 'Hello' });
// }
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient, Prisma } from '@prisma/client'
import util from 'util'

const prisma = new PrismaClient()

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if(req.method === 'POST') {
      const profile = await prisma.user.update({
        where: { 'email': session.user.email },
        data: {
          message: {
            create: {
              'timestamp': req.body.timestamp,
              'name': session.user.name,
              'content': req.body.content,
              'image': req.body.image,
            }
          }
        }
      })
      // Signed in
      console.log(req.body)
      res.status(200).json({ text: 'update success' })
  }
  res.end()
}
