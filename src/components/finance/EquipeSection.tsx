import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, UserCheck } from "lucide-react";
import { TEquipe } from "@/domain/models/encontroComDeus";
import { SelectMembrosRede } from "../Select/SelectMembrosRede";
import { useSession } from "next-auth/react";
import { capitalizeWords } from "@/utils/capitalizaFirst";

interface Props {
  equipeMembers: TEquipe[];
  onAdd: (user: TEquipe) => void;
  onRemove: (id: string) => void;
  onToggleIsento: (id: string) => void;
}

export function EquipeSection({ equipeMembers, onAdd, onRemove, onToggleIsento }: Props) {
  const [selectedUser, setSelectedUser] = useState<{ _id: string; name: string } | null>(null);
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const { data: session } = useSession();
  const churchId = session?.user.churchId;
  const cem = session?.user.cem;

  if (!churchId || !cem) return null;

  const availableUsers = users.filter(
    (u) => !equipeMembers.some((m) => m._id === u._id)
  );

  const handleAdd = () => {
    if (!selectedUser) return;
    
    // ↓ Monta o objeto TEquipe completo
    onAdd({
      _id: selectedUser._id,
      name: selectedUser.name,
      isento: false,
      rede: { _id: cem._id, name: cem.name } // ← ajuste conforme sua estrutura
    });
    
    setSelectedUser(null);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCheck className="h-5 w-5 text-primary" />
          Equipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <SelectMembrosRede
            churchId={churchId}
            cemId={cem._id}
            title="Selecione um membro"
            value={selectedUser?._id ?? ""} // ← extrai _id do objeto
            onChange={setSelectedUser}       // ← recebe { _id, name }
            onDataLoaded={setUsers}
          />
          
          <Button onClick={handleAdd} size="sm" className="gap-1" disabled={!selectedUser}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>

        {equipeMembers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum membro adicionado
          </p>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {equipeMembers.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
            >
              <Checkbox
                checked={m.isento}
                onCheckedChange={() => onToggleIsento(m._id)}
                title="Isento de pagamento"
              />
              <span
                className={`flex-1 text-sm font-medium ${m.isento ? "text-muted-foreground" : ""}`}
              >
                {capitalizeWords(m.name)}
                {m.isento && (
                  <span className="ml-2 text-xs text-muted-foreground">(Isento)</span>
                )}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onRemove(m._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}