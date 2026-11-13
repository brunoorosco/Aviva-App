// components/consagracoes/UserSelectForm.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { TempUserToAdd, TMinisterialLevel } from "@/domain/models/ministerial";
import { PlusIcon, TrashIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useHttpGet, useHttpPut } from "@/hooks/api";
import { getNextMinisterialLevel } from "@/utils/getNextMinisterialLevel";
import { getRedeName } from "@/utils/helpersNameREde";
import { isAdminUser } from "@/lib/isAdminUser";
import { useSession } from "next-auth/react";
import Toast from "../Toast";

interface UserSelectFormProps {
  churchId: string;
  consagracaoId: string;
  currentMinisterialLevel: TMinisterialLevel;
  targetMinisterialLevel: TMinisterialLevel;
  initialUsers: TempUserToAdd[] | undefined;
  onListChange?: (list: TempUserToAdd[]) => void;
  onSaveLabel?: string;
  onSaveHint?: string;
  readOnly?: boolean;
}

const groupedRedesAll = (users: TempUserToAdd[]): string[] =>
  Array.from(new Set(users.map((u) => getRedeName(u.rede) || "Sem Rede")));

type TInputConsagracao = {
  _id: string;
  name: string;
  role: TMinisterialLevel;
  nextRole: TMinisterialLevel;
  email: string;
  cem: { name: string };
};

type GroupedByRede = {
  rede: string;
  users: TempUserToAdd[];
  count: number;
};

export function UserSelectForm({
  churchId,
  consagracaoId,
  currentMinisterialLevel,
  targetMinisterialLevel,
  initialUsers,
  onListChange,
  onSaveLabel,
  onSaveHint,
  readOnly = false,
}: UserSelectFormProps) {
  const [tempList, setTempList] = useState<TempUserToAdd[]>(initialUsers ?? []);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedRedes, setExpandedRedes] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { data: session } = useSession();
  const isAdmin = isAdminUser(session);
  const userRede = session?.user?.cem?.name;

  useEffect(() => {
    if (readOnly && initialUsers && initialUsers.length > 0) {
      setExpandedRedes(new Set(groupedRedesAll(initialUsers)));
    }
  }, [readOnly, initialUsers]);

  // Sincroniza quando o parent trocar de array (nova ref).
  // O parent só troca a ref quando o fetch chega com dados novos do banco,
  // ou quando o usuário fez uma mudança aqui (via onListChange -> setRoleList).
  // Quando o usuário muda aqui, o parent faz re-render com a MESMA ref (o novo
  // array vem de localLists que é o mesmo objeto mutado), então o efeito não dispara.
  const lastInitialRef = useRef<TempUserToAdd[] | undefined>(initialUsers);
  useEffect(() => {
    if (lastInitialRef.current !== initialUsers) {
      lastInitialRef.current = initialUsers;
      setTempList(initialUsers ?? []);
    }
  }, [initialUsers]);

  // ✅ Reporta mudanças para o parent (FormTabs) de forma estável
  const handleListChange = useCallback(
    (list: TempUserToAdd[]) => {
      setTempList(list);
      onListChange?.(list);
    },
    [onListChange],
  );

  const handleAddUserToTemp = useCallback(
    (user: TempUserToAdd) => {
      setTempList((prev) => {
        const exists = prev.some((u) => u.id === user.id);
        if (exists) return prev;
        const next = [...prev, user];
        onListChange?.(next);
        return next;
      });
    },
    [onListChange],
  );

  const handleRemoveUser = useCallback(
    (userId: string) => {
      setTempList((prev) => {
        const next = prev.filter((user) => user.id !== userId);
        onListChange?.(next);
        return next;
      });
    },
    [onListChange],
  );

  function isRoleValid(userRole: string, level: string) {
    const r = userRole.toLowerCase();
    const l = level.toLowerCase();

    if (l === "membro") {
      return r === "membro" || r === "discípulo";
    }

    return r === l;
  }

  const { data, isLoading } = useHttpGet(
    readOnly ? null : `/api/protected/churches/${churchId}/users/cargo/${currentMinisterialLevel}`,
  );

  const ALL_CHURCH_MEMBERS = (data?.data ?? []) as TInputConsagracao[];

  const availableUsers = useMemo(
    () => {
      let filtered = ALL_CHURCH_MEMBERS.filter(
        (user) =>
          isRoleValid(user.role, currentMinisterialLevel) &&
          !tempList.some((temp) => temp.id === user._id),
      );

      if (!isAdmin && userRede) {
        filtered = filtered.filter(
          (user) => getRedeName(user.cem?.name) === userRede,
        );
      }

      return filtered;
    },
    [ALL_CHURCH_MEMBERS, tempList, currentMinisterialLevel, isAdmin, userRede],
  );

  // Filtro por busca separado para o selector
  const searchFiltered = useMemo(
    () => availableUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [availableUsers, searchTerm],
  );

  // Agrupa usuários por rede
  const groupedByRede = useMemo((): GroupedByRede[] => {
    const groups: Record<string, TempUserToAdd[]> = {};

    tempList.forEach((user) => {
      const rede = getRedeName(user.rede) || "Sem Rede";
      if (!groups[rede]) {
        groups[rede] = [];
      }
      groups[rede].push(user);
    });

    return Object.entries(groups)
      .map(([rede, users]) => ({
        rede,
        users: [...users].sort((a, b) => a.name.localeCompare(b.name)),
        count: users.length,
      }))
      .sort((a, b) => a.rede.localeCompare(b.rede));
  }, [tempList]);

  const toggleRede = (rede: string) => {
    setExpandedRedes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rede)) {
        newSet.delete(rede);
      } else {
        newSet.add(rede);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedRedes(new Set(groupedByRede.map((g) => g.rede)));
  };

  const collapseAll = () => {
    setExpandedRedes(new Set());
  };

  const handleAddUser = () => {
    const userToAdd = availableUsers.find((u) => u._id === selectedUserId);
    if (!userToAdd) return;

    handleAddUserToTemp({
      id: userToAdd._id,
      name: userToAdd.name,
      rede: userToAdd.cem?.name || "Sem Rede",
      role: userToAdd.role,
      nextRole: getNextMinisterialLevel(userToAdd.role),
    });

    setSelectedUserId("");
    setSearchTerm("");

    const redeName = getRedeName(userToAdd.cem?.name) || "Sem Rede";
    setExpandedRedes((prev) => new Set([...prev, redeName]));
  };

  const handleSave = async () => {
    if (readOnly) return;
    if (tempList.length === 0) {
      Toast.showError(
        `Nenhum membro na lista de ${targetMinisterialLevel.replace(/_/g, " ")}.`,
      );
      return;
    }

    const payload = tempList.map((user) => ({
      name: user.name,
      rede: user.rede,
      id: user.id,
      role: user.role,
      nextRole: targetMinisterialLevel,
    }));

    setIsSaving(true);
    try {
      await useHttpPut({
        url: `/api/protected/churches/${churchId}/consagracao/${consagracaoId}`,
        data: payload,
      });

      Toast.showSuccess(`${onSaveLabel ?? `Consagrados`}: sucesso!`);
    } catch (error: any) {
      Toast.showError(`Erro: ${error?.message ?? "falha ao salvar"}`);
      console.error("Erro ao consagrar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Formulário de seleção */}
      {!readOnly && (
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 w-full">
          <Label htmlFor={`search-user-${currentMinisterialLevel}`}>Buscar Membro</Label>
          <Input
            id={`search-user-${currentMinisterialLevel}`}
            placeholder="Nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 w-full">
          <Label htmlFor={`select-user-${currentMinisterialLevel}`}>
            Selecionar {currentMinisterialLevel.replace(/_/g, " ")}
          </Label>
          <Select
            value={selectedUserId || undefined}
            onValueChange={(v) => setSelectedUserId(v ?? "")}
          >
            <SelectTrigger
              id={`select-user-${currentMinisterialLevel}`}
              className="h-9 w-full bg-background"
            >
              <SelectValue
                placeholder={`Selecionar ${currentMinisterialLevel.replace(/_/g, " ")}`}
              />
            </SelectTrigger>
            <SelectContent>
              {searchFiltered.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Nenhum usuário disponível
                </div>
              ) : (
                searchFiltered.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} - {user.cem?.name ?? "Sem rede"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleAddUser}
          disabled={!selectedUserId || isLoading}
          className="w-full md:w-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" /> Adicionar à Lista
        </Button>
        </div>
      )}

      {/* Header da lista com totais */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h4 className="text-base sm:text-lg font-semibold">
            Lista de {targetMinisterialLevel.replace(/_/g, " ")}
          </h4>
          {tempList.length > 0 && (
            <span className="px-2.5 py-0.5 text-xs sm:text-sm font-medium text-white bg-primary rounded-full">
              Total: {tempList.length}
            </span>
          )}
        </div>
        {!readOnly && groupedByRede.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={expandAll}>
              Expandir Todos
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={collapseAll}>
              Recolher Todos
            </Button>
          </div>
        )}
      </div>

      {/* Resumo por rede */}
      {tempList.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg">
          {groupedByRede.map((group) => (
            <span
              key={group.rede}
              className="px-2 py-1 text-xs font-medium bg-background border rounded-md cursor-pointer hover:bg-accent"
              onClick={() => toggleRede(group.rede)}
            >
              {group.rede}: <strong>{group.count}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Tabela / lista */}
      {tempList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum membro adicionado para consagração como {targetMinisterialLevel.replace(/_/g, " ")}.
        </p>
      ) : (
        <div className="border rounded-lg max-h-[60vh] overflow-y-auto overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell text-center">Cargo Atual</TableHead>
                <TableHead className="hidden md:table-cell text-center">Próximo Cargo</TableHead>
                {!readOnly && <TableHead className="text-right w-14">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedByRede.map((group) => (
                <React.Fragment key={group.rede}>
                  <TableRow
                    className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleRede(group.rede)}
                  >
                    <TableCell className="w-8 p-2">
                      {expandedRedes.has(group.rede) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </TableCell>
                    <TableCell colSpan={3} className="font-semibold text-sm sm:text-base p-2">
                      {group.rede}
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {group.count} {group.count === 1 ? "membro" : "membros"}
                      </span>
                    </TableCell>
                    {!readOnly && <TableCell></TableCell>}
                  </TableRow>

                  {expandedRedes.has(group.rede) &&
                    group.users.map((user) => (
                      <TableRow key={user.id} className="bg-background">
                        <TableCell className="w-8 p-2"></TableCell>
                        <TableCell className="font-medium pl-4 sm:pl-6 text-sm sm:text-base p-2">
                          {user.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center p-2">
                          {user.role.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center p-2">
                          {user.nextRole.replace(/_/g, " ")}
                        </TableCell>
                        {!readOnly && (
                          <TableCell className="text-right p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveUser(user.id);
                              }}
                              title="Remover da lista"
                            >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Botão salvar */}
      {!readOnly && (
        <div className="flex flex-col gap-2 pt-2">
        <Button
          onClick={handleSave}
          disabled={tempList.length === 0 || isSaving}
          className="w-full"
        >
          {onSaveLabel ?? "Salvar"}
        </Button>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {onSaveHint ?? "Ao clicar, os usuários selecionados serão salvos no banco."}
        </p>
        </div>
      )}
    </div>
  );
}