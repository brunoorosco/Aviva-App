import { NextRequest, NextResponse } from 'next/server'
import { links } from '@/infra/google/accessGoogle'

type TResponse = {
  link: string
  description: string
  icon: string
  name: string
}
export default async (req: NextRequest) => {
  try {
    if (req.method === 'GET') {
      const sheet = await links()
      const rows = await sheet.getRows()
      const datas: TResponse[] = await rows.map((row: any) => {
        return {
          name: row.get('name'),
          description: row.get('description'),
          icon: row.get('icon'),
          link: row.get('link')
        }
      })
      return NextResponse.json(datas, { status: 200 })
    }
  } catch (error) {
    console.error(error)
    //  throw new Error(error as string)
  }
}
