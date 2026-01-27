"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, Loader2, Save, ShieldCheck, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Toast from "@/components/Toast";
import { useSession } from "next-auth/react";
import { useHttpGet } from "@/hooks/api";

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Deve conter pelo menos um número")
  .regex(/[\W_]/, "Deve conter pelo menos um caractere especial");

const profileSchema = z
  .object({
    fullName: z.string().min(3, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
    address: z.string().min(5, "Endereço incompleto").optional().or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: passwordSchema.optional().or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("/favicon-96x96.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { data: session } = useSession();

  // Estados para controlar visibilidade das senhas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Buscar dados do usuário
  const { data: userData, isLoading: isLoadingUser } = useHttpGet<{
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
  }>(`/api/protected/churches/${session?.user.churchId}/users/${session?.user.id}/settings`);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Carregar dados do usuário quando disponível
  useEffect(() => {
    if (userData?.data) {
      form.reset({
        fullName: userData.data.name || "",
        email: userData.data.email || "",
        phone: userData.data.phone || "",
        address: userData.data.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
console.log(userData.data)
      if (userData.data.image) {
        setAvatarPreview(userData.data.image);
      }
    }
  }, [userData, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("phone", values.phone || "");
      formData.append("address", values.address || "");

      if (values.currentPassword && values.newPassword) {
        formData.append("currentPassword", values.currentPassword);
        formData.append("newPassword", values.newPassword);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(
        `/api/protected/churches/${session?.user.churchId}/users/${session?.user.id}/settings`,
        {
          method: "PATCH",
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar perfil");
      }

      Toast.showSuccess("Perfil atualizado com sucesso!");

      // Limpar campos de senha
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");
      setAvatarFile(null);

      // Reset visibilidade das senhas
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      Toast.showError(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (2MB)
      if (file.size > 2 * 1024 * 1024) {
        Toast.showError("A imagem deve ter no máximo 2MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        Toast.showError("Apenas imagens são permitidas");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-4xl mx-auto pt-4 sm:pt-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações de Conta</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gerencie suas informações pessoais e segurança.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Seção de Perfil */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Informações Pessoais</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Atualize seus dados de contato e endereço.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2">
                      <AvatarImage src={avatarPreview} />
                      <AvatarFallback className="text-lg sm:text-xl">
                        {form.watch("fullName")?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                      <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Foto de Perfil</h4>
                    <p className="text-xs text-muted-foreground">JPG, GIF ou PNG. Máximo de 2MB.</p>
                  </div>
                </div>

                {/* Form Fields - Stack on mobile, grid on desktop */}
                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Ruan Davi" {...field} className="h-10 sm:h-11" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled className="h-10 sm:h-11" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 99999-9999"
                            {...field}
                            className="h-10 sm:h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Endereço</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Rua, Número, Bairro"
                            {...field}
                            className="h-10 sm:h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção de Segurança */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Alterar Senha
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Certifique-se de usar uma senha forte e única.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-4">
                {/* Senha Atual */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Senha Atual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 h-10 sm:h-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Separator className="my-3 sm:my-4" />

                {/* Nova Senha e Confirmar - Stack on mobile, grid on desktop */}
                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nova Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              {...field}
                              className="pr-10 h-10 sm:h-11"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-[10px] sm:text-xs">
                          Mín. 8 caracteres, maiúscula, minúscula, número e símbolo.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              className="pr-10 h-10 sm:h-11"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões - Stack on mobile, right-aligned on desktop */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-2">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  form.reset();
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="w-full sm:w-auto h-10 sm:h-11"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-10 sm:h-11">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
