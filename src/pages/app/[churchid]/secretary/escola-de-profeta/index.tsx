'use client'

import React, { useEffect, useState } from 'react'
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
import { Router, useRouter } from 'next/router'
import { TEscolaProfeta } from '@/domain/models/escolaProfeta'

// Tailwind primary color via CSS var
const PRIMARY = '#137fec'

export default function ModulesPage() {
  const [course, setCourse] = useState()
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const [page, setPage] = useState(1)
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
      {/* Header */}
      {/* <header className='flex items-center justify-between px-6 py-3 bg-white border-b md:px-10'>
        <div className='flex items-center gap-3 text-gray-900'>
          <div className='size-8 text-[var(--primary-color)]'>
            <svg
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z'
                fill='currentColor'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold tracking-tight'>CourseCraft</h2>
        </div>

        <nav className='items-center hidden gap-6 text-sm font-medium text-gray-600 md:flex'>
          <a className='hover:text-gray-900' href='#'>
            Home
          </a>
          <a className='hover:text-gray-900' href='#'>
            Courses
          </a>
          <a
            className='text-gray-900 font-semibold border-b-2 border-[var(--primary-color)] pb-1'
            href='#'
          >
            Modules
          </a>
          <a className='hover:text-gray-900' href='#'>
            Students
          </a>
        </nav>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='text-gray-600'>
            <Bell className='size-5' />
            <span className='sr-only'>Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-auto p-0 rounded-full'>
                <Avatar className='size-9'>
                  <AvatarImage
                    src='https://lh3.googleusercontent.com/aida-public/AB6AXuDwR3YDxnwo2gSczP_tscFcZtJONm6Uxw21brADtma9XO-2U7L4HhSKiWU3P2SgR898rwCMc8uXLtfXMMhBUFQnqiwcWRrrAbebiHfUFiHqv3HTFJ8Efw_E_nfCyyl6g7pTpUZNEvq9gj4Fc8lAqD8puQnEt29Kn67nkXKL0o0VxVmPLsvvKmZgaZwXkRIlXjr8BeRwEy3ruP-JKdfI-Wdsbi3qyV7_gyRDr2VvzeG3bqF8RSSwsiuA187gBud0Qd2J5UyEeN5TIoA'
                    alt='User'
                  />
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header> */}

      {/* Main */}
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
                  {courses &&
                    courses?.data.data.map((course) => (
                      <TableRow key={course.tema}>
                        <TableCell className='font-medium text-gray-900'>
                          {course.tema.toUpperCase()}
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {course.data}
                        </TableCell>
                        <TableCell>{course?.alunos?.length ?? 0}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`View ${course._id}`}
                            >
                              <Eye className='w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label={`Edit ${course._id}`}
                            >
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
      </main>
    </div>
  )
}
