"use client";

import React, { useState } from "react";
import { BookOpen, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHttpGet } from "@/hooks/api";
import { useRouter } from "next/router";
import { TEscolaProfeta } from "@/domain/models/escolaProfeta";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ROLES } from "@/lib/permissions";
import { PermissionGuard } from "@/components/PermissionGuard";

export default function ModulesPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { asPath, query } = router;
  const { churchid } = query;
  const limit = 8;

  const { data: courseData, isLoading } = useHttpGet<TEscolaProfeta[]>(
    `/api/protected/churches/${churchid}/escola-profeta?page=${page}&limit=${limit}`,
  );
  const courses = courseData?.data;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Cursos Avivamento</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie módulos e acompanhe o desempenho dos alunos
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Módulos Disponíveis</h2>
          <PermissionGuard roles={[ROLES.ADMIN]}>
            <Button asChild>
              <Link href={`${asPath}/new`}>Novo Módulo</Link>
            </Button>
          </PermissionGuard>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses &&
            // @ts-ignore
            courses?.data.map((course: TEscolaProfeta) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{course.tema}</CardTitle>
                      <Badge
                        variant={
                          course.tipoCurso.toUpperCase() === "ESCOLA DE PROFETA"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {course.tipoCurso}
                      </Badge>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(course.data).toLocaleDateString("pt-BR")} -{" "}
                      {course.diasAula && course.diasAula.length} dias
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {course?.alunos?.length ?? 0} alunos
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`${asPath}/${course._id}`}>Visualizar</Link>
                      </Button>
                      <PermissionGuard roles={[ROLES.ADMIN, ROLES.SECRETARIA]}>
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`${asPath}/${course._id}/edit`}>Editar</Link>
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
