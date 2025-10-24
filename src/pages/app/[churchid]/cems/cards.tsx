'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tribes = [
  { name: 'Rúben', members: 120 },
  { name: 'Simeão', members: 90 },
  { name: 'Levi', members: 75 },
  { name: 'Judá', members: 200 },
  { name: 'Dã', members: 110 },
  { name: 'Naftali', members: 80 },
  { name: 'Gade', members: 95 },
  { name: 'Aser', members: 100 },
  { name: 'Issacar', members: 70 },
  { name: 'Zebulom', members: 65 },
  { name: 'Efraim', members: 180 },
  { name: 'Manassés', members: 180 },
  { name: 'Benjamim', members: 85 }
]


export default function TribesDashboard() {
  const totalMembers = tribes.reduce((acc, t) => acc + t.members, 0)

  return (
    <div className='p-2'>
      <h1 className='text-2xl bg-transparent font-bold mb-6'>Nossas Redes</h1>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {tribes.map((tribe) => (
          <Card
            onClick={() => console.log('teste')}
            key={tribe.name}
            className='rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer'
          >
            <CardHeader className='flex flex-col items-center'>
              <CardTitle className='mt-2 text-lg'>{tribe.name}</CardTitle>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='text-gray-600'>{tribe.members} membros</p>
            </CardContent>
          </Card>
        ))}

        {/* Card Todos */}
        <Card className='col-span-2 sm:col-span-3 lg:col-span-4 rounded-2xl shadow-lg bg-blue-100'>
          <CardHeader className='flex flex-col items-center'>
            <span className='text-4xl'>⭐</span>
            <CardTitle className='mt-2 text-lg'>Todos</CardTitle>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-gray-800 font-semibold'>
              {totalMembers} membros ao todo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
