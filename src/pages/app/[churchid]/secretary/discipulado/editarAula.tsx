import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { ArrowLeft, Plus, Save, Trash2, UserPlus, Search } from "lucide-react";
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
import { useUpdateAula, useActiveUsersWithNetwork, useAulaById } from "@/hooks/useDiscipulado";
import { AulaDiscipulado, AlunoPresenca, MinistroDaAula } from "@/domain/models/discupulado";
import { cn } from "@/lib/utils";


const EditAula = () => {
    const router = useRouter();
    const { id, churchid } = router.query;
    const churchId = churchid as string;

    const { data: aula, isLoading: loadingAula } = useAulaById(churchId, id as string | undefined);
    const { data: usuariosAtivos = [] } = useActiveUsersWithNetwork(churchId);
    const updateAula = useUpdateAula(churchId, () => {
        Toast.showSuccess("Aula atualizada com sucesso!");
        setTimeout(() => router.push(`/app/${churchId}/secretary/discipulado`), 500);
    });

    // ✅ States movidos para antes dos returns condicionais
    const [data, setData] = useState<Date | undefined>(undefined);
    const [tema, setTema] = useState("");
    const [ministradorNome, setMinistradorNome] = useState("");
    const [alunos, setAlunos] = useState<AlunoPresenca[]>([]);
    const [membroSelecionado, setMembroSelecionado] = useState("");
    const [busca, setBusca] = useState("");

    // ✅ Sincroniza state quando aula carrega
    useEffect(() => {
        if (!aula) return;
        setData(new Date(aula.data));
        setTema(aula.tema);
        setMinistradorNome(
            typeof aula.ministrador === "string" ? aula.ministrador : aula.ministrador?.nome || ""
        );
        setAlunos(aula.alunos || []);
    }, [aula]);

    const hasLoadedOnce = useRef(false);

    useEffect(() => {
        if (loadingAula) {
            hasLoadedOnce.current = true;
            return;
        }
        // Só redireciona se já carregou pelo menos uma vez E não tem aula
        if (hasLoadedOnce.current && !aula) {
            Toast.showError("Aula não encontrada");
            setTimeout(() => router.push(`/app/${churchId}/secretary/discipulado`), 1000);
        }
    }, [aula, loadingAula, router, churchId]);

    // ✅ Early returns depois de todos os hooks
    if (!churchId || loadingAula || !aula) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

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
                celula: "",
                rede: { name: usuario.rede?.name || "", _id: usuario.rede?._id || "" },
                presente: true,
            },
            ...prev,
        ]);
        setMembroSelecionado("");
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
        if (!data || !tema || !ministradorNome) {
            Toast.showError("Preencha todos os campos obrigatórios");
            return;
        }

        const ministrador: MinistroDaAula = {
            membroId: "",
            nome: ministradorNome,
            rede: { name: "", _id: "" },
        };

        updateAula.mutate({ ...aula, data: data.toISOString(), tema, ministrador, alunos });
    };

    const totalPresentes = alunos.filter((a) => a.presente).length;
    return (
        <div className="min-h-screen bg-background text-foreground mt-6">
            {/* Header fixo */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/app/${churchId}/secretary/discipulado`)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-bold">Editar Aula</h1>
                    </div>
                    <Button onClick={handleSalvar} disabled={updateAula.isLoading} className="gap-2">
                        <Save className="h-4 w-4" />
                        {updateAula.isLoading ? "Salvando..." : "Salvar Alterações"}
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
                            <Label>Tema da Aula *</Label>
                            <Input placeholder="Ex: A importância da oração" value={tema} onChange={(e) => setTema(e.target.value)} />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Ministrado por *</Label>
                            <Input placeholder="Nome" value={ministradorNome} onChange={(e) => setMinistradorNome(e.target.value)} />
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

                        {/* Adicionar aluno — busca e seleção */}
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Buscar para adicionar</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Digite o nome do aluno..."
                                        value={membroSelecionado}
                                        onChange={(e) => setMembroSelecionado(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {membroSelecionado && (
                                    <div className="border border-border rounded-lg bg-card/50 max-h-[200px] overflow-y-auto shadow-sm">
                                        {(usuariosFiltrados.filter(u =>
                                            u.name.toLowerCase().includes(membroSelecionado.toLowerCase())
                                        ) || []).map((usuario) => (
                                            <div
                                                key={usuario._id}
                                                onClick={() => {
                                                    handleAddAluno(usuario._id);
                                                    setMembroSelecionado(""); // Limpa a busca após adicionar
                                                }}
                                                className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-0 flex flex-col transition-colors"
                                            >
                                                <span className="font-medium text-sm">{usuario.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {usuario.rede?.name || "Sem rede"} • {usuario.role}
                                                </span>
                                            </div>
                                        ))}
                                        {usuariosFiltrados.filter(u =>
                                            u.name.toLowerCase().includes(membroSelecionado.toLowerCase())
                                        ).length === 0 && (
                                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                                    Nenhum aluno encontrado
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>

                            {/* Campo de busca na lista de chamada (pessoas já adicionadas) */}
                            {/* {alunos.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-border">
                                    <Label className="text-sm font-medium">Filtrar lista de chamada</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Filtrar por nome na lista..."
                                            value={busca}
                                            onChange={(e) => setBusca(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Lista de alunos adicionados */}
                        {alunos.length > 0 ? (
                            <div className="border border-border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">✓</TableHead>
                                            <TableHead>Aluno</TableHead>
                                            <TableHead>Rede</TableHead>
                                            <TableHead className="w-[50px]" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {alunos
                                            .filter((a) =>
                                                a.nome.toLowerCase().includes(busca.toLowerCase())
                                            )
                                            .map((aluno) => (
                                                <TableRow key={aluno.membroId} className={cn(!aluno.presente && "opacity-50")}>
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            checked={aluno.presente}
                                                            onCheckedChange={() => handleTogglePresenca(aluno.membroId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {aluno.rede?.name || "-"}
                                                    </TableCell>
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
                                <p className="text-sm">Nenhum aluno nesta aula</p>
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
                        <Button onClick={handleSalvar} disabled={updateAula.isLoading} className="gap-2">
                            <Save className="h-4 w-4" />
                            Salvar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditAula;
