// 'use client'

// import { useForm, useFieldArray, Controller } from 'react-hook-form'
// import { useRef, useState } from 'react'
// import { useRouter } from 'next/router'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import ImportButton, { LeaderPair } from '@/components/visitaDePaz/ImportButton'
// import { useHttpPost } from '@/hooks/api'
// import { useSession } from 'next-auth/react'
// import Toast from '@/components/Toast'
// import { Button } from '@/components/ui/button'
// import { Loader2Icon } from 'lucide-react'

// type FormValues = {
//   casas: LeaderPair[]
//   data_inicial: string
// }

// const NovaVisitaDePaz = () => {
//   const { control, handleSubmit, watch } = useForm<FormValues>({
//     defaultValues: {
//       casas: [],
//       data_inicial: new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
//     }
//   })

//   const inputFileRef = useRef<HTMLInputElement>(null)
//   const { fields, append, remove } = useFieldArray({ control, name: 'casas' })
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const { data: session } = useSession()
//   const casas = watch('casas')

//   const onSubmit = handleSubmit(async (data) => {
//     if (!data.casas || data.casas.length === 0) {
//       Toast.showError('Adicione pelo menos uma Casa de Paz antes de salvar!')
//       return
//     }

//     setIsLoading(true)
//     const response = await useHttpPost({
//       url: `/api/protected/churches/${session?.user.churchId}/visitasdepaz`,
//       data
//     })
//     setIsLoading(false)

//     if (response?.error) {
//       Toast.showError('Erro ao salvar Casas de Paz!')
//     } else {
//       Toast.showSuccess('Casas de Paz cadastradas com sucesso!')
//       router.back()
//     }
//   })

//   const handleImport = (imported: LeaderPair[]) => {
//     fields.forEach((_, index) => remove(index))
//     imported.forEach((casa) => append(casa))
//   }

//   return (
//     <div className='p-4'>
//       <div className='flex justify-between items-center mb-4'>
//         <h1 className='text-2xl'>Visita de Paz</h1>

//         <div className='flex items-end gap-2'>
//           <Controller
//             name='data_inicial'
//             control={control}
//             render={({ field }) => (
//               <div className='flex flex-col'>
//                 <Label>Data</Label>
//                 <Input {...field} type='date' />
//               </div>
//             )}
//           />

//           <ImportButton inputFileRef={inputFileRef} onImport={handleImport} />
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className='flex flex-col gap-4'>
//         {fields.map((field, index) => (
//           <div
//             key={field.id}
//             className='border border-gray-400 p-4 rounded-lg bg-gray-50 flex flex-col gap-4'
//           >
//             {/* Linha 1: Líder 1, Líder 2, Rede */}
//             <div className='flex gap-4'>
//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.lider1`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Líder 1' />
//                     </div>
//                   )}
//                 />
//               </div>

//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.lider2`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Líder 2' />
//                     </div>
//                   )}
//                 />
//               </div>

//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.rede`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Rede' />
//                     </div>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Linha 2: Endereço, Anfitriã, Telefone */}
//             <div className='flex gap-4'>
//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.endereco`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Endereço' />
//                     </div>
//                   )}
//                 />
//               </div>

//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.anfitria`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Anfitriã' />
//                     </div>
//                   )}
//                 />
//               </div>

//               <div className='flex-1'>
//                 <Controller
//                   name={`casas.${index}.telefone`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className='flex flex-col'>
//                       <Input {...field} placeholder='Telefone' />
//                     </div>
//                   )}
//                 />
//               </div>

//               <button
//                 type='button'
//                 className='px-2 py-1 bg-red-500 text-white rounded'
//                 onClick={() => remove(index)}
//               >
//                 Remover
//               </button>
//             </div>
//           </div>
//         ))}
//         <div className='flex gap-2 justify-end'>
//           <div>
//             <Button
//               type='button'
//               className=' bg-blue-500 text-white rounded'
//               onClick={() =>
//                 append({
//                   lider1: '',
//                   lider2: '',
//                   endereco: '',
//                   rede: '',
//                   anfitria: '',
//                   telefone: ''
//                 })
//               }
//             >
//               + Adicionar Visita
//             </Button>
//           </div>
//           <div>
//             <Button
//               className='bg-[#04AA6D] text-white hover:bg-[#04AA6Daa] hover:text-white'
//               type='submit'
//               disabled={isLoading || !casas || casas.length === 0}
//             >
//               {isLoading ? <Loader2Icon className='animate-spin' /> : 'Salvar'}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default NovaVisitaDePaz

"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ImportButton, { LeaderPair } from "../../../../components/casaDePaz/ImportButton";
import { useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2, Plus } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/permissions";
import { PermissionGuard } from "@/components/PermissionGuard";

type FormValues = {
  casas: LeaderPair[];
  data_inicial: string;
};

const NovaVisitaDePaz = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      casas: [],
      data_inicial: new Date().toISOString().split("T")[0],
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove } = useFieldArray({ control, name: "casas" });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();
  const casas = watch("casas");

  // Verifica se pode editar o campo rede
  const canEditRede = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA]);
  const defaultRede = session?.user?.cem?.name || "";

  // Ao adicionar nova casa, preenche automaticamente a rede se não puder editar
  const handleAddCasa = () => {
    append({
      lider1: "",
      lider2: "",
      endereco: "",
      rede: canEditRede ? "" : defaultRede,
      anfitria: "",
      telefone: "",
    });
  };

  // Quando importar, preenche a rede se necessário
  const handleImport = (imported: LeaderPair[]) => {
    fields.forEach((_, index) => remove(index));
    imported.forEach((casa) => {
      append({
        ...casa,
        rede: canEditRede ? casa.rede : defaultRede,
      });
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!data.casas || data.casas.length === 0) {
      Toast.showError("Adicione pelo menos uma Casa de Paz antes de salvar!");
      return;
    }

    setIsLoading(true);
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/visitasdepaz`,
      data,
    });
    setIsLoading(false);

    if (response?.error) {
      Toast.showError("Erro ao salvar Visita de Paz!");
    } else {
      Toast.showSuccess("Visita de Paz cadastradas com sucesso!");
      router.back();
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Nova Visita de Paz</h1>

        <div className="flex flex-row sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <Label className="mb-1">Data Inicial</Label>
            <Controller
              name="data_inicial"
              control={control}
              render={({ field }) => <Input {...field} type="date" className="w-full sm:w-auto" />}
            />
          </div>
          <PermissionGuard roles={[ROLES.ADMIN, ROLES.SECRETARIA]}>
            <div className="mt-4">
              <ImportButton inputFileRef={inputFileRef} onImport={handleImport} />
            </div>
          </PermissionGuard>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {fields.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4 text-center">Nenhuma Visita de Paz adicionada ainda</p>
              <Button
                type="button"
                onClick={handleAddCasa}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Visita
              </Button>
            </CardContent>
          </Card>
        ) : (
          fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {/* Linha 1: Líderes e Rede */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Label className="mb-2">Líder 1 *</Label>
                      <Controller
                        name={`casas.${index}.lider1`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Nome do Líder 1" />}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Líder 2/Auxiliar</Label>
                      <Controller
                        name={`casas.${index}.lider2`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Nome do Líder 2" />}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">
                        Rede *
                        {!canEditRede && (
                          <span className="text-xs text-gray-500 ml-2">(automático)</span>
                        )}
                      </Label>
                      <Controller
                        name={`casas.${index}.rede`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nome da Rede"
                            disabled={!canEditRede}
                            className={!canEditRede ? "bg-gray-100 cursor-not-allowed" : ""}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Linha 2: Detalhes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Label className="mb-2">Anfitriã</Label>
                      <Controller
                        name={`casas.${index}.anfitria`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Nome da anfitriã" />}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Telefone</Label>
                      <Controller
                        name={`casas.${index}.telefone`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="(00) 00000-0000" type="tel" />
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label className="mb-2">Endereço</Label>
                      <Controller
                        name={`casas.${index}.endereco`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Rua, número, bairro" />
                        )}
                      />
                    </div>
                  </div>

                  {/* Botão Remover */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover Visita
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Botões de Ação */}
        {fields.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCasa}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Outra Visita
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !casas || casas.length === 0}
              className="bg-[#04AA6D] hover:bg-[#04AA6D]/90 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Visitas de Paz"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NovaVisitaDePaz;
