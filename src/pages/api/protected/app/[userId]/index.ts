import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const { userId } = req.query

      if (userId) {
        const user =null

        if (!user) {
          return res.status(404).json({ message: 'Church invalid' })
        }

        return res.status(200).json(user)
      }

      return res.status(204).json({})
    }
  } catch (e) {
    console.error(e)
  }
}
