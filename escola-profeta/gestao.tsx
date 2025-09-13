'use client'

import React from 'react'
import { Bell, Eye, Edit, Trash2, Plus } from 'lucide-react'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

// Tailwind primary color via CSS var
const PRIMARY = '#137fec'

const rows = [
  {
    name: 'Introduction to Programming',
    course: 'Computer Science 101',
    status: 'Published' as const
  },
  {
    name: 'Advanced Data Structures',
    course: 'Computer Science 202',
    status: 'Draft' as const
  },
  {
    name: 'Machine Learning Fundamentals',
    course: 'Data Science 301',
    status: 'Published' as const
  },
  {
    name: 'Web Development Basics',
    course: 'Web Development 101',
    status: 'Published' as const
  },
  {
    name: 'Mobile App Development',
    course: 'Mobile Development 201',
    status: 'Draft' as const
  }
]

export default function ModulesPage() {
  return (
    <div
      className='min-h-screen bg-gray-50'
      style={{ ['--primary-color' as any]: PRIMARY }}
    >
      {/* Header */}
      <header className='flex items-center justify-between px-6 py-3 bg-white border-b md:px-10'>
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
      </header>

      {/* Main */}
      <main className='px-6 py-8 md:px-10'>
        <div className='mx-auto max-w-7xl'>
          <div className='flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-2xl font-bold text-gray-900 md:text-3xl'>
              Manage Modules
            </h1>
            <Button className='bg-[var(--primary-color)] hover:opacity-90'>
              <Plus className='mr-2 size-4' />
              New Module
            </Button>
          </div>

          <Card className='overflow-hidden'>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50'>
                    <TableHead>Module Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className='font-medium text-gray-900'>
                        {row.name}
                      </TableCell>
                      <TableCell className='text-gray-600'>
                        {row.course}
                      </TableCell>
                      <TableCell>
                        {row.status === 'Published' ? (
                          <Badge className='text-green-800 bg-green-100 hover:bg-green-100'>
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            variant='secondary'
                            className='text-yellow-800 bg-yellow-100 hover:bg-yellow-100'
                          >
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            aria-label={`View ${row.name}`}
                          >
                            <Eye className='size-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            aria-label={`Edit ${row.name}`}
                          >
                            <Edit className='size-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-red-600 hover:text-red-700'
                            aria-label={`Delete ${row.name}`}
                          >
                            <Trash2 className='size-4' />
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
