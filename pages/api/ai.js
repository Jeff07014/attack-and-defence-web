// export default function handler(req, res) {
//   res.status(200).json({ text: 'Hello' });
// }
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ai = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method === 'GET') {
    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          ai: true,
        },
      })
      console.log(user.ai)
      res.status(200).json(user.ai)
    } else {
      res.status(200).json([])
    }
  } else if (req.method === 'POST') {
    if (session) {
      const message =
        '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"' +
        req.body.content +
        '"}]}'
      const chat = await fetch('https://openai80.p.rapidapi.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'eb96d89092msh50c75b887a87291p162bc8jsn776cc2fb3ecd',
          'X-RapidAPI-Host': 'openai80.p.rapidapi.com',
        },
        body: message,
      }).then((r) => r.json())
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          ai: {
            create: {
              timestamp: req.body.timestamp,
              content: chat.choices[0].message.content,
            },
          },
        },
      })
      // Signed in
      console.log(chat.choices[0].message)
      res.status(200).json({ text: 'update success' })
    } else {
      res.status(401)
    }
  }
  res.end()
}

export default ai
