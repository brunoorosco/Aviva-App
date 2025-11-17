import { useState } from "react";
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
import { PlusIcon, TrashIcon } from "lucide-react";
import { useHttpGet } from "@/hooks/api";
import { getNextMinisterialLevel } from "@/utils/getNextMinisterialLevel";

interface UserSelectFormProps {
  currentMinisterialLevel: TMinisterialLevel; // O cargo que o usuário deve TER para ser selecionado
  targetMinisterialLevel: TMinisterialLevel; // O cargo para o qual ele será consagrado
  onAddUser: (user: TempUserToAdd) => void;
  onRemoveUser: (userId: string) => void;
  tempList: TempUserToAdd[]; // Lista atual de usuários temporários para esta aba
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
      !tempList.some((temp) => temp._id === user._id) &&
      !initialUsers.some((init) => init._id === user._id) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const userToAdd = availableUsers.find((u) => u._id === selectedUserId);
    if (userToAdd) {
      onAddUser({
        _id: userToAdd._id,
        name: userToAdd.name,
        rede: userToAdd.cem.name,
        role: userToAdd.role,
        nextRole: getNextMinisterialLevel(userToAdd.role),
      });
      setSelectedUserId(""); // Limpa a seleção
      setSearchTerm(""); // Limpa o termo de busca
    }
  };

  return (
    <div className="space-y-4">
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

      <h4 className="mt-6 text-lg font-semibold">
        Lista Temporária de {targetMinisterialLevel.replace(/_/g, " ")}
      </h4>
      {tempList.length === 0 ? (
        <p className="text-gray-600">
          Nenhum membro adicionado para consagração como {targetMinisterialLevel.replace(/_/g, " ")}
          .
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Rede</TableHead>
              <TableHead className="text-center">Cargo Atual</TableHead>
              <TableHead className="text-center">Próximo Cargo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tempList.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium capitalize">{user.name.toLowerCase()}</TableCell>
                <TableCell className="capitalize">{user.rede.toLowerCase()}</TableCell>
                <TableCell className="text-center">{user.role.replace(/_/g, " ")}</TableCell>
                <TableCell className="text-center">{user.nextRole}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveUser(user._id)}
                    title="Remover da lista"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
