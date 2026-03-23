import { useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Plus, Search, Trash2, UserPlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Toast from "@/components/Toast";
import { useCreateAula, useMembros, useCiclos, useActiveUsersWithNetwork } from "@/hooks/useDiscipulado";
import { AlunoPresenca, MinistroDaAula } from "@/domain/models/discupulado";
import { cn } from "@/lib/utils";

const NovaAulaDiscipulado = () => {
    const router = useRouter();
    const { query } = router;
    const churchId = query.churchid as string | undefined;

    const { data: membros = [] } = useMembros(churchId);
    const { data: ciclos = [] } = useCiclos(churchId);
    const { data: usuariosAtivos = [] } = useActiveUsersWithNetwork(churchId);

    const createAula = useCreateAula(churchId, () => {
        Toast.showSuccess("Aula salva com sucesso!");
        setTimeout(() => router.push(`/app/${churchId}/secretary/discipulado`), 500);
    });

    const [data, setData] = useState<Date | undefined>(new Date());
    const [tema, setTema] = useState("");
    const [ministrador, setMinistrador] = useState<MinistroDaAula | undefined>(undefined);
    const [cicloId, setCicloId] = useState(() => {
        return "";
    });
    const [alunos, setAlunos] = useState<AlunoPresenca[]>([]);
    const [busca, setBusca] = useState("");
    const [membroSelecionado, setMembroSelecionado] = useState("");

    // Set default ciclo when loaded
    const cicloAtivo = ciclos?.find((c) => c.ativo) || ciclos?.[0];
    if (!cicloId && cicloAtivo) {
        setCicloId(cicloAtivo.id);
    }

    // Filtra usuários para o select (exclui os já adicionados)
    const usuariosFiltrados = (usuariosAtivos || []).filter(
        (u) => !alunos.some((a) => a.membroId === u._id)
    );

    const handleAddAluno = (usuarioId?: string) => {
        const id = usuarioId || membroSelecionado;
        if (!id) return;
        const usuario = usuariosAtivos?.find((u) => u._id === id);
        if (!usuario) return;
        if (alunos.some((a) => a.membroId === usuario._id)) return;

        setAlunos((prev) => [
            {
                membroId: usuario._id,
                nome: usuario.name,
                rede: { name: usuario.rede?.name || "-", _id: usuario.rede?._id || "" },
                presente: true
            },
            ...prev,
        ]);
        setMembroSelecionado("");
    };

    const handleAddMinistro = (usuarioId?: string) => {
        const id = usuarioId || membroSelecionado;
        if (!id) return;
        const usuario = usuariosAtivos?.find((u) => u._id === id);
        if (!usuario) return;
        if (alunos.some((a) => a.membroId === usuario._id)) return;

        setMinistrador(
            {
                membroId: usuario._id,
                nome: usuario.name,
                rede: { name: usuario.rede?.name || "-", _id: usuario.rede?._id || "" },
            },
        );
    };

    const handleRemoveAluno = (membroId: string) => {
        setAlunos((prev) => prev.filter((a) => a.membroId !== membroId));
    };

    const handleTogglePresenca = (membroId: string) => {
        setAlunos((prev) =>
            prev.map((a) => (a.membroId === membroId ? { ...a, presente: !a.presente } : a))
        );
    };

    const handleSalvar = () => {
        if (!data || !tema || !ministrador) {
            Toast.showError("Preencha todos os campos obrigatórios");
            return;
        }
        if (alunos.length === 0) {
            Toast.showError("Adicione pelo menos um aluno");
            return;
        }

        createAula.mutate({
            data: data.toISOString(),
            tema,
            ministrador,
            cicloId,
            alunos
        });
    };

    const totalPresentes = alunos.filter((a) => a.presente).length;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header fixo */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/app/${churchId}/secretary/discipulado`)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-bold">Nova Aula</h1>
                    </div>
                    <Button onClick={handleSalvar} disabled={createAula.isLoading} className="gap-2">
                        <Save className="h-4 w-4" />
                        {createAula.isLoading ? "Salvando..." : "Salvar Aula"}
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Dados da aula */}
                <Card>
                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data *</Label>
                            <Input
                                type="date"
                                value={data ? format(data, "yyyy-MM-dd") : ""}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setData(undefined);
                                        return;
                                    }
                                    const [year, month, day] = e.target.value.split("-").map(Number);
                                    setData(new Date(year, month - 1, day));
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            {/* <Label>Ciclo *</Label>
                            <Select value={cicloId} onValueChange={setCicloId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o ciclo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(ciclos || []).map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.nome} {c.ativo && "●"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
                        </div>

                        <div className="space-y-2">
                            <Label>Tema da Aula *</Label>
                            <Input placeholder="Ex: A importância da oração" value={tema} onChange={(e) => setTema(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Ministrado por *</Label>
                            <Select value={ministrador?.membroId} onValueChange={handleAddMinistro}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um usuário" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {(usuariosFiltrados || []).map((usuario) => (
                                        <SelectItem key={usuario._id} value={usuario._id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{usuario.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Adicionar aluno — seção principal */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-primary" />
                                <h2 className="font-semibold text-lg">Chamada</h2>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {totalPresentes}/{alunos.length} presentes
                            </span>
                        </div>

                        {/* Select de usuários ativos */}
                        <div className="flex gap-2">
                            <Select value={membroSelecionado} onValueChange={handleAddAluno}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um usuário para adicionar" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {(usuariosFiltrados || []).map((usuario) => (
                                        <SelectItem key={usuario._id} value={usuario._id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{usuario.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {usuario.rede?.name || "Sem rede"} • {usuario.role}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => handleAddAluno(membroSelecionado)}
                                disabled={!membroSelecionado}
                                size="icon"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Lista de alunos adicionados */}
                        {alunos.length > 0 ? (
                            <div className="border border-border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">✓</TableHead>
                                            <TableHead>Aluno</TableHead>
                                            <TableHead>Célula</TableHead>
                                            <TableHead className="w-[50px]" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {alunos.map((aluno) => (
                                            <TableRow key={aluno.membroId} className={cn(!aluno.presente && "opacity-50")}>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={aluno.presente}
                                                        onCheckedChange={() => handleTogglePresenca(aluno.membroId)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{aluno.nome}</TableCell>
                                                <TableCell className="text-muted-foreground">{aluno.rede.name}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveAluno(aluno.membroId)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <UserPlus className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Busque e adicione os alunos conforme chegam</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Barra inferior fixa com resumo */}
            {alunos.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 z-10">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{totalPresentes}</span> presentes ·{" "}
                            <span className="font-semibold text-foreground">{alunos.length - totalPresentes}</span> ausentes
                        </p>
                        <Button onClick={handleSalvar} disabled={createAula.isLoading} className="gap-2">
                            <Save className="h-4 w-4" />
                            Salvar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NovaAulaDiscipulado;
