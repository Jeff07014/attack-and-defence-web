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
  if (session) {
    if(req.method === 'GET') {
        const profile = await prisma.user.findUnique({
          where: {
            'email': session.user.email,
          },
        })
        // Signed in
        // console.log(session, profile)
        res.status(200).json(profile)
    }
    else if (req.method === 'POST') {
      console.log(req.body)
      const profile = await prisma.user.update({
        where: {
          'email': session.user.email,
        },
        data: {
          'name': req.body.username,
          'image': req.body.image ? req.body.image : session.user.image,
        },
      })
      res.status(200).json({ text:'success' })
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
