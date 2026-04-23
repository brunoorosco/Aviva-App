import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useHttpGet } from "@/hooks/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Waves,
  Heart,
  Flame,
  Star,
  Activity
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const { churchid } = router.query;

  const { data: performanceData, isLoading } = useHttpGet<any>(
    session ? `/api/protected/churches/${churchid}/users/${session.user.id}/performance` : null
  );

  if (isLoading || !performanceData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { user, performance } = performanceData.data;

  const journeyItems = [
    { id: "batizado", label: "Batismo", icon: Waves, active: performance.jornada.batizado, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "encontroComDeus", label: "Encontro", icon: Flame, active: performance.jornada.encontroComDeus, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { id: "sejaLivre", label: "Seja Livre", icon: Heart, active: performance.jornada.sejaLivre, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { id: "reencontroComDeus", label: "Reencontro", icon: Star, active: performance.jornada.reencontroComDeus, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { id: "escolaProfeta", label: "Escola de Profeta", icon: GraduationCap, active: performance.jornada.escolaProfeta, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  const completedSteps = journeyItems.filter(item => item.active).length;
  const journeyProgress = Math.round((completedSteps / journeyItems.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="relative">
        <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl shadow-lg"></div>
        <Card className="border-0 shadow-xl -mt-12 overflow-hidden bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-md">
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white dark:border-dark-secondary shadow-2xl">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="text-2xl sm:text-4xl bg-secondary text-secondary-foreground">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 border-2 border-white dark:border-dark-secondary rounded-full p-1.5 shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">
                    {user.name}
                  </h1>
                  <Badge variant="secondary" className="w-fit mx-auto md:mx-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 capitalize px-3 py-1">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {user.cem?.name || "Sem Rede"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex flex-col items-center p-4 bg-gray-50/50 dark:bg-dark-primary/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Membro desde</span>
                <span className="text-lg font-bold">{new Date(user.createdAt).getFullYear()}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50/50 dark:bg-dark-primary/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Frequência Discip.</span>
                <span className="text-lg font-bold text-green-600">{performance.discipulado.aproveitamento}%</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50/50 dark:bg-dark-primary/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Jornada</span>
                <span className="text-lg font-bold text-blue-600">{journeyProgress}%</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50/50 dark:bg-dark-primary/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</span>
                <span className="text-lg font-bold text-green-600">Ativo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journey Progress */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-dark-primary/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Jornada Espiritual</CardTitle>
                  <CardDescription>Acompanhe seu progresso nos módulos fundamentais.</CardDescription>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progresso Geral</span>
                    <span>{journeyProgress}%</span>
                  </div>
                  <Progress value={journeyProgress} className="h-3 bg-gray-100 dark:bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {journeyItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${item.active
                          ? "bg-white dark:bg-dark-secondary border-green-200 dark:border-green-900/30 shadow-md"
                          : "bg-gray-50/50 dark:bg-dark-primary/50 border-gray-100 dark:border-gray-800 grayscale"
                        }`}
                    >
                      <div className={`p-3 rounded-lg mr-4 ${item.bg} ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white uppercase text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">
                          {item.active ? "Concluído" : "Pendente"}
                        </p>
                      </div>
                      {item.active && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discipleship Attendance */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-dark-primary/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Frequência no Discipulado</CardTitle>
                  <CardDescription>Suas presenças nas aulas do ciclo atual.</CardDescription>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {performance.discipulado.aulas.length > 0 ? (
                  performance.discipulado.aulas.map((aula: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-primary border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${aula.presente ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-400"}`}></div>
                        <div>
                          <p className="text-sm font-bold uppercase">{aula.tema}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(aula.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={aula.presente ? "success" : "destructive"} className="text-[10px] uppercase font-bold tracking-wider">
                        {aula.presente ? "Presente" : "Falta"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">Nenhum registro de aula encontrado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                Próximo Passo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 leading-relaxed">
                {journeyProgress < 100
                  ? "Você está indo muito bem! Continue sua jornada para se tornar um líder frutífero."
                  : "Parabéns! Você concluiu todos os passos fundamentais. Agora é hora de frutificar!"}
              </p>
              <Button variant="secondary" className="w-full mt-6 bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-md">
                Ver Requisitos Ministeriais
              </Button>
            </CardContent>
          </Card>

          {/* Ministries */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50/50 dark:bg-dark-primary/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Meus Ministérios
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {user.ministerios && user.ministerios.length > 0 ? (
                  user.ministerios.map((m: any) => (
                    <div key={m._id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-primary transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.cargo}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center italic py-4">
                    Nenhum ministério vinculado.
                  </p>
                )}
                <Button variant="outline" className="w-full border-dashed border-2 hover:border-primary hover:text-primary mt-2">
                  Participar de um Ministério
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
