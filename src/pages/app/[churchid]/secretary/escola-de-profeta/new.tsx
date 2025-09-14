'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function CreateModulePage() {
  return (
    <div className='relative flex flex-col min-h-screen font-sans bg-gray-50'>
      {/* Main */}
      <main className='flex-1 py-12 bg-gray-50'>
        <div className='container max-w-4xl px-4 mx-auto'>
          <div className='p-8 bg-white border border-gray-200 rounded-lg shadow-sm'>
            {/* Form Header */}
            <div className='pb-6 mb-8 border-b border-gray-200'>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
                Novo Modúlo da Escola de Profeta
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                Fill in the details below to create a new course module.
              </p>
            </div>

            {/* Form */}
            <form className='space-y-8'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2'>
                {/* Module Name */}
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='module-name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Nome do Modúlo
                  </label>
                  <Input id='module-name' className='mt-2' />
                </div>

                {/* Description */}
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Descrição
                  </label>
                  <Textarea
                    id='description'
                    rows={4}
                    placeholder='A brief description of what this module covers.'
                    className='mt-2'
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label
                    htmlFor='start-date'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Data
                  </label>
                  <Input id='start-date' type='date' className='mt-2' />
                </div>

                {/* Lessons Count */}
                <div>
                  <label
                    htmlFor='lesson-count'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Número de Aulas
                  </label>
                  <Input
                    id='lesson-count'
                    type='number'
                    placeholder='e.g., 10'
                    className='mt-2'
                  />
                </div>
              </div>

              {/* Students */}
              {/* <div className='pt-8 space-y-8 border-t border-gray-200'>
                <h3 className='text-xl font-semibold leading-7 text-gray-900'>
                  Alunos
                </h3>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                  Adicionar Estudantes
                </p>
                <div className='mt-6'>
                  <label
                    htmlFor='select-students'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Seleção Aluno
                  </label>
                  <Select>
                    <SelectTrigger id='select-students' className='mt-2'>
                      <SelectValue placeholder='Choose students...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='alice'>Alice Johnson</SelectItem>
                      <SelectItem value='bob'>Bob Williams</SelectItem>
                      <SelectItem value='charlie'>Charlie Brown</SelectItem>
                      <SelectItem value='diana'>Diana Prince</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='mt-2 text-xs text-gray-500'>
                    You can select multiple students by holding Ctrl/Cmd and
                    clicking.
                  </p>
                </div>
              </div> */}

              {/* Lesson Dates */}
              <div className='pt-4 space-y-8 border-t border-gray-200'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Data das Aulas
                </h3>
                <div className='mt-2 overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aula</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {['Aula 1', 'Aula 2', 'Aula 3'].map((lesson, i) => (
                        <TableRow key={i}>
                          <TableCell className='font-medium'>
                            {lesson}
                          </TableCell>
                          <TableCell>
                            <Input type='date' />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center justify-end pt-8 border-t border-gray-200 gap-x-6'>
                <Button type='button' variant='ghost'>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-[var(--primary-color)] hover:bg-opacity-85'
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
