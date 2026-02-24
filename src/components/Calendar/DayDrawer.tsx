import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, CalendarDays, Check, X } from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TEvent } from "@/domain/models/events";
import { EventTypeConfig } from "@/hooks/useEventTypes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  events: TEvent[];
  eventTypes: EventTypeConfig[];
  onEdit: (eventId: string, data: Partial<TEvent>) => void;
  onDelete: (id: string) => void;
}

export function DayDrawer({ open, onOpenChange, date, events, eventTypes, onEdit, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TEvent> | null>(null);
  
  const getEventTypeColor = (eventTypeId: string) => {
    return eventTypes.find(t => t.id === eventTypeId)?.color || "#cccccc";
  };
  
  const getEventTypeName = (eventTypeId: string) => {
    return eventTypes.find(t => t.id === eventTypeId)?.label || "Sem tipo";
  };

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setEditForm(null);
    }
  }, [open]);

  if (!date) return null;

  const startEditing = (ev: TEvent) => {
    setEditingId(ev._id!);
    setEditForm({ ...ev });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEditing = () => {
    if (editForm && editForm.titulo?.trim() && editForm.dataInicio && editForm.dataFim && editingId) {
      onEdit(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 left-auto w-full max-w-md rounded-l-[10px] rounded-t-none">
        <div className="mx-auto w-full max-w-lg px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="capitalize">
              {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DrawerTitle>
            <DrawerDescription>
              {events.length === 0 ? "Nenhum evento neste dia." : `${events.length} evento(s)`}
            </DrawerDescription>
          </DrawerHeader>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CalendarDays className="h-10 w-10 mb-2 opacity-40" />
              <span className="text-sm">Sem eventos para este dia</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {events.map((ev) => {
                const isEditing = editingId === ev._id;

                if (isEditing && editForm) {
                  return (
                    <div
                      key={ev._id}
                      className="rounded-lg border border-primary p-4 space-y-3"
                      style={{ borderLeftWidth: 4, borderLeftColor: getEventTypeColor(editForm.eventTypeId!) }}
                    >
                      <div className="space-y-2">
                        <Label className="text-xs">Título</Label>
                        <Input
                          value={editForm.titulo || ""}
                          onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Tipo</Label>
                        <Select value={editForm.eventTypeId} onValueChange={(v) => setEditForm({ ...editForm, eventTypeId: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: t.color }} />
                                  {t.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Início</Label>
                          <Input
                            type="date"
                            value={editForm.dataInicio}
                            onChange={(e) => setEditForm({ ...editForm, dataInicio: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Fim</Label>
                          <Input
                            type="date"
                            value={editForm.dataFim}
                            onChange={(e) => setEditForm({ ...editForm, dataFim: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Descrição</Label>
                        <Textarea
                          value={editForm.descricao || ""}
                          onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={saveEditing} disabled={!editForm.titulo?.trim() || !editForm.dataInicio || !editForm.dataFim}>
                          <Check className="h-4 w-4 mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={ev._id}
                    className="rounded-lg border border-border p-3"
                    style={{ borderLeftWidth: 4, borderLeftColor: getEventTypeColor(ev.eventTypeId) }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{ev.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">{getEventTypeName(ev.eventTypeId)}</span>
                          {" · "}
                          {ev.dataInicio === ev.dataFim
                            ? ev.dataInicio
                            : `${ev.dataInicio} → ${ev.dataFim}`}
                        </p>
                        {ev.descricao && (
                          <p className="text-xs text-muted-foreground mt-1">{ev.descricao}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(ev)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(ev._id!)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
