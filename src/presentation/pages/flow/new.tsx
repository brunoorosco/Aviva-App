'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { useRouter } from 'next/router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type User = { name: string; role: string }
type Auxiliar = { name: string; users: User[] }
type Leader = { name1: string; name2: string; auxiliares: Auxiliar[] }
type Cem = { name: string; leaders: Leader[] }
type SupervisorGroup = { sup1: string; sup2: string; cems: Cem[] }

export default function HierarchyForm() {
  const [pastor, setPastor] = useState('')
  const [groups, setGroups] = useState<SupervisorGroup[]>([
    { sup1: '', sup2: '', cems: [] },
    { sup1: '', sup2: '', cems: [] },
    { sup1: '', sup2: '', cems: [] },
    { sup1: '', sup2: '', cems: [] }
  ])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async () => {
    const payload = { pastor, groups }
    try {
      setIsLoading(true)
      setError('')
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/flow`,
        data: payload
      })

      setIsLoading(false)
      if (response) {
        Toast.showSuccess('Salvo com Sucesso!')
      }

      if (response?.error) {
        Toast.showError('Erro ao Salvar!')
        setError('')
        return
      }

      router.back()
    } catch (error) {
      setIsLoading(false)
      console.log('[LOGIN_ERROR]: ', error)
    }
  }

  const addCem = (groupIndex: number) => {
    const newGroups = [...groups]
    newGroups[groupIndex].cems.push({
      name: '',
      leaders: [{ name1: '', name2: '', auxiliares: [] }]
    })
    setGroups(newGroups)
  }

  const addAuxiliar = (gIdx: number, cIdx: number, lIdx: number) => {
    const newGroups = [...groups]
    newGroups[gIdx].cems[cIdx].leaders[lIdx].auxiliares.push({
      name: '',
      users: []
    })
    setGroups(newGroups)
  }

  const addUser = (gIdx: number, cIdx: number, lIdx: number, aIdx: number) => {
    const newGroups = [...groups]
    newGroups[gIdx].cems[cIdx].leaders[lIdx].auxiliares[aIdx].users.push({
      name: '',
      role: ''
    })
    setGroups(newGroups)
  }

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      {/* Pastor */}
      <Card>
        <CardContent className='space-y-4 mt-2'>
          <Label className='text-lg font-semibold'>Pastor Responsável</Label>
          <Input
            placeholder='Nome do Pastor'
            value={pastor}
            onChange={(e) => setPastor(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Tabs para grupos de supervisão */}
      <Tabs defaultValue='0' className='w-full'>
        <TabsList className='grid grid-cols-4 gap-2'>
          {groups.map((g, idx) => (
            <TabsTrigger key={idx} value={idx.toString()}>
              {g.sup1 && g.sup2 ? `${g.sup1} & ${g.sup2}` : `Grupo ${idx + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group, gIdx) => (
          <TabsContent key={gIdx} value={gIdx.toString()}>
            <Card className='p-4 space-y-4'>
              <h2 className='text-lg font-bold'>
                Grupo de Supervisão {gIdx + 1}
              </h2>

              {/* Supervisores */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Supervisor 1</Label>
                  <Input
                    value={group.sup1}
                    onChange={(e) => {
                      const newGroups = [...groups]
                      newGroups[gIdx].sup1 = e.target.value
                      setGroups(newGroups)
                    }}
                  />
                </div>
                <div>
                  <Label>Supervisor 2</Label>
                  <Input
                    value={group.sup2}
                    onChange={(e) => {
                      const newGroups = [...groups]
                      newGroups[gIdx].sup2 = e.target.value
                      setGroups(newGroups)
                    }}
                  />
                </div>
              </div>

              {/* CEMs */}
              <Button variant='outline' onClick={() => addCem(gIdx)}>
                + Adicionar CEM
              </Button>

              <div className='space-y-6'>
                {group.cems.map((cem, cIdx) => (
                  <Card
                    key={cIdx}
                    className='p-4 space-y-4 border-l-4 border-blue-500'
                  >
                    <Label className='font-semibold'>CEM {cIdx + 1}</Label>
                    <Input
                      placeholder='Nome da CEM'
                      value={cem.name}
                      onChange={(e) => {
                        const newGroups = [...groups]
                        newGroups[gIdx].cems[cIdx].name = e.target.value
                        setGroups(newGroups)
                      }}
                    />

                    {/* Líderes */}
                    {cem.leaders.map((leader, lIdx) => (
                      <div
                        key={lIdx}
                        className='p-3 border rounded-md space-y-3'
                      >
                        <Label className='font-medium'>Líder {lIdx + 1}</Label>
                        <div className='grid grid-cols-2 gap-3'>
                          <Input
                            placeholder='Líder 1'
                            value={leader.name1}
                            onChange={(e) => {
                              const newGroups = [...groups]
                              newGroups[gIdx].cems[cIdx].leaders[lIdx].name1 =
                                e.target.value
                              setGroups(newGroups)
                            }}
                          />
                          <Input
                            placeholder='Líder 2'
                            value={leader.name2}
                            onChange={(e) => {
                              const newGroups = [...groups]
                              newGroups[gIdx].cems[cIdx].leaders[lIdx].name2 =
                                e.target.value
                              setGroups(newGroups)
                            }}
                          />
                        </div>

                        {/* Auxiliares */}
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => addAuxiliar(gIdx, cIdx, lIdx)}
                        >
                          + Adicionar Auxiliar
                        </Button>

                        {leader.auxiliares.map((aux, aIdx) => (
                          <div key={aIdx} className='pl-4 border-l-2 space-y-2'>
                            <Input
                              placeholder='Nome do Auxiliar'
                              value={aux.name}
                              onChange={(e) => {
                                const newGroups = [...groups]
                                newGroups[gIdx].cems[cIdx].leaders[
                                  lIdx
                                ].auxiliares[aIdx].name = e.target.value
                                setGroups(newGroups)
                              }}
                            />

                            {/* Usuários do Auxiliar */}
                            <Button
                              size='default'
                              variant='outline'
                              onClick={() => addUser(gIdx, cIdx, lIdx, aIdx)}
                            >
                              + Adicionar Usuário
                            </Button>

                            {aux.users.map((user, uIdx) => (
                              <div
                                key={uIdx}
                                className='grid grid-cols-2 gap-2'
                              >
                                <Input
                                  placeholder='Nome do usuário'
                                  value={user.name}
                                  onChange={(e) => {
                                    const newGroups = [...groups]
                                    newGroups[gIdx].cems[cIdx].leaders[
                                      lIdx
                                    ].auxiliares[aIdx].users[uIdx].name =
                                      e.target.value
                                    setGroups(newGroups)
                                  }}
                                />
                                <Input
                                  placeholder='Cargo/posição'
                                  value={user.role}
                                  onChange={(e) => {
                                    const newGroups = [...groups]
                                    newGroups[gIdx].cems[cIdx].leaders[
                                      lIdx
                                    ].auxiliares[aIdx].users[uIdx].role =
                                      e.target.value
                                    setGroups(newGroups)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Button
        className='w-full bg-green-600 hover:bg-green-700 text-white'
        onClick={handleSubmit}
      >
        Salvar Estrutura
      </Button>
    </div>
  )
}
