'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  Trash2, 
  Plus,
  Crown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useHttpGet, useHttpDelete, useHttpPost } from '@/hooks/api'
import { TMinisterios } from '@/domain/models/churchs'
import Toast from '@/components/Toast'
import { getInitialsName } from '@/utils/getInitialName'
import SelectMembersMultiple from '@/components/Select/SelectMembersMultiple'

export default function MinisterioDetalhes() {
  const router = useRouter()
  const { ministerioid, churchid } = router.query
  const { data: session } = useSession()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteType, setDeleteType] = useState<'ministerio' | 'lider' | 'membro'>('ministerio')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showAddLideres, setShowAddLideres] = useState(false)
  const [showAddMembros, setShowAddMembros] = useState(false)
  const [selectedLideres, setSelectedLideres] = useState<{ _id: string; name: string }[]>([])
  const [selectedMembros, setSelectedMembros] = useState<{ _id: string; name: string }[]>([])

  const baseUrl = `/api/protected/churches/${churchid}/ministerios/${ministerioid}`
  
  const { data: ministerioData, isLoading, mutate } = useHttpGet<TMinisterios>(
    ministerioid && churchid ? baseUrl : null
  )

  const ministerio = ministerioData?.data

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'secretaria'

  const handleRemoveLider = (userId: string) => {
    setDeleteType('lider')
    setSelectedUserId(userId)
    setShowDeleteDialog(true)
  }

  const handleRemoveMembro = (userId: string) => {
    setDeleteType('membro')
    setSelectedUserId(userId)
    setShowDeleteDialog(true)
  }

  const handleDeleteMinisterio = () => {
    setDeleteType('ministerio')
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      if (deleteType === 'ministerio') {
        await useHttpDelete({ url: baseUrl })
        Toast.showSuccess('Ministério deletado com sucesso!')
        router.push(`/app/${churchid}/secretary/ministerios`)
      } else {
        const tipo = deleteType === 'lider' ? 'lider' : 'membro'
        await useHttpDelete({
          url: `${baseUrl}/membros`,
          data: { userId: selectedUserId, tipo }
        })
        Toast.showSuccess(`${deleteType === 'lider' ? 'Líder' : 'Membro'} removido com sucesso!`)
        mutate()
      }
    } catch (error) {
      Toast.showError('Erro ao remover')
      console.error(error)
    } finally {
      setShowDeleteDialog(false)
      setSelectedUserId(null)
    }
  }

  const handleAddLideres = async () => {
    try {
      for (const lider of selectedLideres) {
        await useHttpPost({
          url: `${baseUrl}/membros`,
          data: { userId: lider._id, userName: lider.name, tipo: 'lider' }
        })
      }
      Toast.showSuccess('Líderes adicionados com sucesso!')
      setSelectedLideres([])
      setShowAddLideres(false)
      mutate()
    } catch (error) {
      Toast.showError('Erro ao adicionar líderes')
      console.error(error)
    }
  }

  const handleAddMembros = async () => {
    try {
      for (const membro of selectedMembros) {
        await useHttpPost({
          url: `${baseUrl}/membros`,
          data: { userId: membro._id, userName: membro.name, tipo: 'membro' }
        })
      }
      Toast.showSuccess('Membros adicionados com sucesso!')
      setSelectedMembros([])
      setShowAddMembros(false)
      mutate()
    } catch (error) {
      Toast.showError('Erro ao adicionar membros')
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  if (!ministerio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Ministério não encontrado</div>
      </div>
    )
  }

  const totalMembros = (ministerio.lideres?.length || 0) + (ministerio.membros?.length || 0)

  return (
    <div className="min-h-screen bg-background mt-4">
      {/* Header Sticky */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ministerio.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {totalMembros} {totalMembros === 1 ? 'pessoa' : 'pessoas'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMinisterio}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Deletar</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Descrição */}
        {ministerio.description && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{ministerio.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Líderes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <div>
                  <CardTitle>Líderes</CardTitle>
                  <CardDescription>
                    {ministerio.lideres?.length || 0} {ministerio.lideres?.length === 1 ? 'líder' : 'líderes'}
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddLideres(!showAddLideres)}
                variant={showAddLideres ? 'secondary' : 'default'}
              >
                {showAddLideres ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Líderes */}
            {showAddLideres && (
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <SelectMembersMultiple
                  selectedPeople={selectedLideres}
                  onSelectionChange={setSelectedLideres}
                  label="Buscar líderes"
                  placeholder="Digite o nome..."
                />
                {selectedLideres.length > 0 && (
                  <Button onClick={handleAddLideres} className="w-full">
                    Adicionar {selectedLideres.length} {selectedLideres.length === 1 ? 'líder' : 'líderes'}
                  </Button>
                )}
              </div>
            )}

            {/* Lista de Líderes */}
            {ministerio.lideres && ministerio.lideres.length > 0 ? (
              <div className="space-y-2">
                {ministerio.lideres.map((lider) => (
                  <div
                    key={lider._id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          {getInitialsName(lider.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {lider.name}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Líder
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLider(lider._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                Nenhum líder cadastrado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Membros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle>Membros</CardTitle>
                  <CardDescription>
                    {ministerio.membros?.length || 0} {ministerio.membros?.length === 1 ? 'membro' : 'membros'}
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddMembros(!showAddMembros)}
                variant={showAddMembros ? 'secondary' : 'default'}
              >
                {showAddMembros ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Membros */}
            {showAddMembros && (
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <SelectMembersMultiple
                  selectedPeople={selectedMembros}
                  onSelectionChange={setSelectedMembros}
                  label="Buscar membros"
                  placeholder="Digite o nome..."
                />
                {selectedMembros.length > 0 && (
                  <Button onClick={handleAddMembros} className="w-full">
                    Adicionar {selectedMembros.length} {selectedMembros.length === 1 ? 'membro' : 'membros'}
                  </Button>
                )}
              </div>
            )}

            {/* Lista de Membros */}
            {ministerio.membros && ministerio.membros.length > 0 ? (
              <div className="space-y-2">
                {ministerio.membros.map((membro) => (
                  <div
                    key={membro._id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {getInitialsName(membro.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {membro.name}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Membro
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMembro(membro._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                Nenhum membro cadastrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === 'ministerio' 
                ? 'Deletar Ministério?' 
                : `Remover ${deleteType === 'lider' ? 'Líder' : 'Membro'}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'ministerio' ? (
                <>
                  Esta ação não pode ser desfeita. O ministério será removido permanentemente
                  e todos os membros e líderes serão desvinculados.
                  <br /><br />
                  <strong className="text-destructive">
                    Total de pessoas que serão desvinculadas: {totalMembros}
                  </strong>
                </>
              ) : (
                `Esta pessoa será removida do ministério e o ministério será removido do perfil dela.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteType === 'ministerio' ? 'Deletar Ministério' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
