import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, Users } from "lucide-react";
import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { EncontristaModal } from "./EncontristaModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Props {
  encontristas: TPeople[];
  onAdd: (data: TPeople) => void;
  onEdit: (id: string, data: TPeople) => void;
  onRemove: (id: string) => void;
  onLinkEquipe: (encontristaId: string, equipeMembroId: string | undefined) => void;
}

export function EncontristasSection({ encontristas, onAdd, onEdit, onRemove }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TPeople | null>(null);

  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (e: TPeople) => {
    setEditing(e);
    setModalOpen(true);
  };

  const handleSave = (data: TPeople) => {
    if (editing) {
      onEdit(editing._id as string, data);
    } else {
      onAdd(data);
    }
  };

  return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              (Re)Encontristas
            </CardTitle>
            <Button onClick={handleNew} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {encontristas.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum encontrista adicionado
            </p>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {encontristas.map((e) => (
              <div
                key={e._id}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
              >
                <span
                  className={`flex-1 text-sm font-medium truncate ${e.isento ? "line-through text-muted-foreground" : ""}`}
                >
                  {e.nome}
                  {e.isento && <span className="ml-2 text-xs text-muted-foreground">(Isento)</span>}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(e)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setSelectedToDelete(e._id as string)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EncontristaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        encontrista={editing}
      />

      <ConfirmDialog
        open={!!selectedToDelete}
        onClose={() => setSelectedToDelete(null)}
        onConfirm={() => {
          if (selectedToDelete) {
            onRemove(selectedToDelete);
            setSelectedToDelete(null);
          }
        }}
        title="Remover Participante"
        description="Tem certeza que deseja remover este participante? Todas as informações vinculadas a ele serão perdidas."
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}
