'use client'

import React, { useState } from 'react'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { useHttpGet } from '@/hooks/api'
import { useRouter } from 'next/router'
import { TEscolaProfeta } from '@/domain/models/escolaProfeta'

// Tailwind primary color via CSS var
const PRIMARY = '#137fec'

export default function ModulesPage() {
  const [page, setPage] = useState(1)
  const router = useRouter()
  const { asPath, query } = router
  const { churchid } = query
  const limit = 8

  const { data: courses } = useHttpGet<{
    data: TEscolaProfeta[]
    total: number
    page: number
    totalPages: number
  }>(
    `/api/protected/churches/${churchid}/escola-profeta?page=${page}&limit=${limit}`
  )

  return (
    <div
      className='min-h-screen bg-gray-50'
      style={{ ['--primary-color' as any]: PRIMARY }}
    >
      <main className='px-6 py-2 md:px-10'>
        <div className='mx-auto max-w-7xl'>
          <div className='flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-2xl font-bold text-gray-900 md:text-3xl'>
              Escola de Profeta
            </h1>
            <Button
              className='bg-[var(--primary-color)] hover:opacity-90'
              onClick={() => router.push(asPath + '/new')}
            >
              <Plus className='mr-2 size-4' />
              Novo Modúlo
            </Button>
          </div>

          {/* Desktop/Table view */}
          <div className='hidden sm:block'>
            <Card className='overflow-hidden'>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50'>
                      <TableHead>Tema</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead className='text-right'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses?.data.data.map((course) => (
                      <TableRow key={course.tema}>
                        <TableCell className='font-medium text-gray-900'>
                          {course.tema.toUpperCase()}
                        </TableCell>
                        <TableCell className='text-gray-600'>{course.data}</TableCell>
                        <TableCell>{course?.alunos?.length ?? 0}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-1'>
                            <Button variant='ghost' size='icon' aria-label={`View ${course._id}`}>
                              <Eye className='w-4' />
                            </Button>
                            <Button variant='ghost' size='icon' aria-label={`Edit ${course._id}`}>
                              <Edit className='w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-red-600 hover:text-red-700'
                              aria-label={`Delete ${course._id}`}
                            >
                              <Trash2 className='w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Card view */}
          <div className='sm:hidden flex flex-col gap-4'>
            {courses?.data.data.map((course) => (
              <Card key={course._id}>
                <CardContent className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg'>{course.tema.toUpperCase()}</h2>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='icon' aria-label={`View ${course._id}`}>
                        <Eye className='w-4' />
                      </Button>
                      <Button variant='ghost' size='icon' aria-label={`Edit ${course._id}`}>
                        <Edit className='w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-600 hover:text-red-700'
                        aria-label={`Delete ${course._id}`}
                      >
                        <Trash2 className='w-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='text-gray-600'>Data: {course.data}</div>
                  <div>Alunos: {course?.alunos?.length ?? 0}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
