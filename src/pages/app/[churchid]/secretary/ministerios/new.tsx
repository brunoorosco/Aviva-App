"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { useHttpPost } from "@/hooks/api";
import Toast from "@/components/Toast";
import { Masks } from "@/utils/masks";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Textarea } from "@/components/ui/textarea";
import { TMinisterios } from "@/domain/models/churchs";
import SelectMembersMultiple from "@/components/Select/SelectMembersMultiple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Person = {
  _id: string;
  name: string;
};

const NewMinisterio = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lideres, setLideres] = useState<Person[]>([]);
  const [membros, setMembros] = useState<Person[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Toast.showError("O nome do ministério é obrigatório!");
      return;
    }

    try {
      setIsLoading(true);

      const data: TMinisterios = {
        _id: "",
        name: name.trim(),
        description: description.trim() || undefined,
        lideres: lideres,
        membros: membros,
      };

      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/ministerios`,
        data,
      });

      setIsLoading(false);

      if (response?.error) {
        Toast.showError("Erro ao Salvar!");
        return;
      }

      Toast.showSuccess("Ministério criado com sucesso!");
      router.back();
    } catch (error) {
      setIsLoading(false);
      console.error("[ERROR]:", error);
      Toast.showError("Erro ao salvar ministério");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                Novo Ministério
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Preencha as informações do ministério
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome do Ministério *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(Masks.inputName(e.target.value))}
                  placeholder="Ex: Ministério de Louvor"
                  className="w-full"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição (opcional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva as atividades e propósito do ministério..."
                  className="w-full min-h-[100px]"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Líderes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCog className="w-5 h-5" />
                Líderes do Ministério
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione as pessoas responsáveis pela liderança
              </p>
            </CardHeader>
            <CardContent>
              <SelectMembersMultiple
                selectedPeople={lideres}
                onSelectionChange={setLideres}
                label="Buscar Líderes"
                placeholder="Digite o nome do líder..."
              />
            </CardContent>
          </Card>

          {/* Membros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Membros do Ministério
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione os membros que participam deste ministério
              </p>
            </CardHeader>
            <CardContent>
              <SelectMembersMultiple
                selectedPeople={membros}
                onSelectionChange={setMembros}
                label="Buscar Membros"
                placeholder="Digite o nome do membro..."
              />
            </CardContent>
          </Card>

          {/* Botão Submit */}
          <div className="sticky bottom-0 bg-background pt-4 pb-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto order-2 sm:order-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <div className="w-full sm:flex-1 order-1 sm:order-2">
                <ButtonSubmit
                  text="Criar Ministério"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMinisterio;
