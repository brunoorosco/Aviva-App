import { useState } from "react";
import { useRouter } from "next/router";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventTypes, EventTypeConfig } from "@/hooks/useEventTypes";

const PRESET_COLORS = [
  "#F97316", // Orange
  "#c22c0e", // Green
  "#3B82F6", // Blue
  "#A855F7", // Purple
  "#FACC15", // Yellow
  "#EF4444", // Red
  "#11f20a",
  "#EC4899", // Pink
  "#0ae7f2", // Emerald
  "#008f15", // Amber
  "#0EA5E9",
];

export default function Admin() {
  const router = useRouter();
  const { churchid } = router.query;
  const { eventTypes, addEventType, updateEventType, deleteEventType, loading } = useEventTypes(
    churchid as string,
  );
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addEventType({ label: newLabel.trim(), color: newColor });
    setNewLabel("");
    setNewColor(PRESET_COLORS[0]);
  };

  const startEdit = (t: EventTypeConfig) => {
    setEditingId(t.id);
    setEditLabel(t.label);
    setEditColor(t.color);
  };

  const saveEdit = () => {
    if (editingId && editLabel.trim()) {
      updateEventType(editingId, { label: editLabel.trim(), color: editColor });
      setEditingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-[Montserrat] text-foreground mb-8">Eventos</h1>

        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tipos de Evento</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Gerencie os tipos de evento e suas cores no calendário.
          </p>

          {/* List */}
          <div className="space-y-3 mb-6">
            {eventTypes.map((t) => {
              if (editingId === t.id) {
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-secondary/50"
                  >
                    <Input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="flex-1"
                      placeholder="Nome do tipo"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-7 h-7 rounded-md border-2 transition-all ${editColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={!editLabel.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <div
                    className="w-5 h-5 rounded-sm shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="flex-1 font-medium text-foreground">{t.label}</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteEventType(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add new */}
          <div className="border-t border-border pt-5">
            <Label className="text-sm font-semibold text-foreground mb-3 block">
              Adicionar novo tipo
            </Label>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nome do tipo de evento"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-6 h-6 rounded-md border-2 transition-all ${newColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Button onClick={handleAdd} disabled={!newLabel.trim()} className="gap-2">
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
