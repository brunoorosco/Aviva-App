'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import * as XLSX from 'xlsx'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'

export default function CreateModulePage() {
  const [moduleName, setModuleName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [lessonCount, setLessonCount] = useState<number | ''>('')
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { data: session } = useSession()

  const fileInputRef = useRef<HTMLInputElement>(null)

  type Aluno = {
    nome: string
    presencas: boolean[]
    status: string
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 })

      // A primeira linha é o header
      const headers: string[] = jsonData[0] as string[]

      // Descobre quais colunas são aulas (todas entre "Nome" e "Status")
      const aulaIndices = headers
        .map((h, i) => ({ h, i }))
        .filter(
          (col) => col.h !== 'Nome' && col.h !== 'Status' && col.h !== 'Igreja'
        )
        .map((col) => col.i)

      const parsed: Aluno[] = (jsonData.slice(1) as any[])
        .filter((row: any[]) => row[0] && row[0].toString().trim() !== '') // filtra linhas sem nome
        .map((row: any[]) => ({
          nome: row[0],
          presencas: aulaIndices.map((i) => row[i] === 'P'), // true se 'P'
          status: row[headers.indexOf('Status')] || '',
          igreja: row[headers.indexOf('Igreja')] || ''
        }))

      setAlunos(parsed)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSave = async () => {
    if (!moduleName || !startDate || !lessonCount) {
      alert('Preencha os campos obrigatórios!')
      return
    }

    if (alunos.length === 0) {
      alert('Importe pelo menos um aluno antes de salvar!')
      return
    }

    const payload = {
      tema: moduleName,
      descricao: description,
      data: startDate,
      numeroAulas: lessonCount,
      alunos,
      tipoCurso: 'ESCOLA DE PROFETA'
    }

    try {
      setIsSaving(true)

      const response = await fetch(
        `/api/protected/churches/${session?.user.churchId}/escola-profeta`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) throw new Error('Erro ao salvar módulo')

      Toast.showSuccess("Salvo com sucesso")
      setModuleName('')
      setDescription('')
      setStartDate('')
      setLessonCount('')
      setAlunos([])
    } catch (error) {
      console.error(error)
      Toast.showError("Erro ao salvar")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='relative flex flex-col min-h-screen font-sans bg-gray-50'>
      <main className='flex-1 py-12 bg-gray-50'>
        <div className='container max-w-4xl px-4 mx-auto'>
          <div className='p-8 bg-white border border-gray-200 rounded-lg shadow-sm'>
            {/* Header */}
            <div className='pb-6 mb-8 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
                  Novo Modúlo da Escola de Profeta
                </h2>
                <p className='mt-2 text-sm text-gray-600'>
                  Preencha os detalhes abaixo para criar um novo módulo.
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.xlsx,.xls,.csv'
                  className='hidden'
                  onChange={handleImport}
                />
                <Button
                  type='button'
                  className='bg-blue-500 text-white'
                  onClick={() => fileInputRef.current?.click()}
                >
                  Importar Alunos
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className='space-y-8'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <label className='block text-sm font-medium text-gray-900'>
                    Nome do Modúlo
                  </label>
                  <Input
                    className='mt-2'
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label className='block text-sm font-medium text-gray-900'>
                    Descrição
                  </label>
                  <Textarea
                    className='mt-2'
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900'>
                    Data
                  </label>
                  <Input
                    type='date'
                    className='mt-2'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900'>
                    Número de Aulas
                  </label>
                  <Input
                    type='number'
                    placeholder='ex: 10'
                    className='mt-2'
                    value={lessonCount}
                    onChange={(e) => setLessonCount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Alunos Importados */}
              {alunos.length > 0 && (
                <div className='pt-8 border-t border-gray-200'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    Alunos Importados
                  </h3>
                  <div className='mt-4 overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          {alunos[0]?.presencas.map((_, i) => (
                            <TableHead key={i}>{`Aula ${i + 1}`}</TableHead>
                          ))}
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alunos.map((aluno, i) => (
                          <TableRow key={i}>
                            <TableCell>{aluno.nome}</TableCell>
                            {aluno.presencas.map((p, j) => (
                              <TableCell key={j}>{p ? 'P' : 'F'}</TableCell>
                            ))}
                            <TableCell>{aluno.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className='flex items-center justify-end pt-8 border-t border-gray-200 gap-x-6'>
                <Button type='button' variant='ghost'>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='bg-primary hover:bg-opacity-85'
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
