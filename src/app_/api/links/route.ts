import { NextRequest, NextResponse } from 'next/server'
import { links } from '@/infra/google/accessGoogle'

type TResponse = {
  link: string
  description: string
  icon: string
  name: string
}
export async function GET(req: NextRequest, res: NextResponse) {
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
  return NextResponse.json(datas)
}
