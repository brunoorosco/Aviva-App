// components/consagracoes/UserSelectForm.tsx
import { useState, useMemo } from "react";
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
import { useHttpGet } from "@/hooks/api";
import { getNextMinisterialLevel } from "@/utils/getNextMinisterialLevel";
import { getRedeName } from "@/utils/helpersNameREde";

interface UserSelectFormProps {
  currentMinisterialLevel: TMinisterialLevel;
  targetMinisterialLevel: TMinisterialLevel;
  onAddUser: (user: TempUserToAdd) => void;
  onRemoveUser: (userId: string) => void;
  tempList: TempUserToAdd[];
  churchId: string;
  initialUsers: TempUserToAdd[];
}

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
  currentMinisterialLevel,
  targetMinisterialLevel,
  onAddUser,
  onRemoveUser,
  tempList,
  churchId,
  initialUsers,
}: UserSelectFormProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedRedes, setExpandedRedes] = useState<Set<string>>(new Set());

  function isRoleValid(userRole: string, level: string) {
    const r = userRole.toLowerCase();
    const l = level.toLowerCase();

    if (l === "membro") {
      return r === "membro" || r === "discípulo";
    }

    return r === l;
  }

  const { data, isLoading } = useHttpGet(
    `/api/protected/churches/${churchId}/users/cargo/${currentMinisterialLevel}`
  );

  const ALL_CHURCH_MEMBERS = (data?.data ?? []) as TInputConsagracao[];

  const availableUsers = ALL_CHURCH_MEMBERS.filter(
    (user) =>
      isRoleValid(user.role, currentMinisterialLevel) &&
      !tempList.some((temp) => temp.id === user._id) &&
      !initialUsers.some((init) => init.id === user._id) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        users: users.sort((a, b) => a.name.localeCompare(b.name)),
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
    if (userToAdd) {
      onAddUser({
        id: userToAdd._id,
        name: userToAdd.name,
        rede: userToAdd.cem.name,
        role: userToAdd.role,
        nextRole: getNextMinisterialLevel(userToAdd.role),
      });
      setSelectedUserId("");
      setSearchTerm("");
      // Expande automaticamente a rede do usuário adicionado
      setExpandedRedes((prev) => new Set([...prev, userToAdd.cem.name]));
    }
  };

  return (
    <div className="space-y-4">
      {/* Formulário de seleção */}
      <div className="flex flex-col items-end gap-4 md:flex-row">
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
          <Label htmlFor={`select-user-${currentMinisterialLevel}`}>Selecionar Membro</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id={`select-user-${currentMinisterialLevel}`} className="capitalize">
              <SelectValue
                placeholder={`Selecionar ${currentMinisterialLevel.replace(/_/g, " ")}`}
              />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.length === 0 ? (
                <SelectItem value="no-users" disabled>
                  Nenhum usuário disponível
                </SelectItem>
              ) : (
                availableUsers.map((user) => (
                  <SelectItem key={user._id} value={user._id} className="capitalize">
                    {user.name.toLowerCase()} - {user.cem.name.toLowerCase()}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddUser} disabled={!selectedUserId} className="w-full md:w-auto">
          <PlusIcon className="w-4 h-4 mr-2" /> Adicionar à Lista
        </Button>
      </div>

      {/* Header da lista com totais */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4">
          <h4 className="text-lg font-semibold">
            Lista de {targetMinisterialLevel.replace(/_/g, " ")}
          </h4>
          {tempList.length > 0 && (
            <span className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-full">
              Total: {tempList.length}
            </span>
          )}
        </div>
        {groupedByRede.length > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expandir Todos
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Recolher Todos
            </Button>
          </div>
        )}
      </div>

      {/* Resumo por rede */}
      {tempList.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
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

      {/* Tabela com scroll */}
      {tempList.length === 0 ? (
        <p className="text-gray-600">
          Nenhum membro adicionado para consagração como {targetMinisterialLevel.replace(/_/g, " ")}.
        </p>
      ) : (
        <div className="border rounded-lg max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Cargo Atual</TableHead>
                <TableHead className="text-center">Próximo Cargo</TableHead>
                <TableHead className="text-right w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedByRede.map((group) => (
                <>
                  {/* Header da Rede (clicável) */}
                  <TableRow
                    key={`rede-${group.rede}`}
                    className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleRede(group.rede)}
                  >
                    <TableCell className="w-8">
                      {expandedRedes.has(group.rede) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </TableCell>
                    <TableCell colSpan={3} className="font-semibold capitalize">
                      {group.rede.toLowerCase()}
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {group.count} {group.count === 1 ? "membro" : "membros"}
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Usuários da Rede (expandível) */}
                  {expandedRedes.has(group.rede) &&
                    group.users.map((user) => (
                      <TableRow key={user.id} className="bg-background">
                        <TableCell></TableCell>
                        <TableCell className="font-medium capitalize pl-6">
                          {user.name.toLowerCase()}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.role.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="text-center">{user.nextRole}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveUser(user.id);
                            }}
                            title="Remover da lista"
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
