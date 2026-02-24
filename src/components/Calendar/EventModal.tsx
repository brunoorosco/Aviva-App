import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
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
  event: TEvent | null;
  onSave: (event: Omit<TEvent, '_id'>) => void;
  eventTypes: EventTypeConfig[];
  churchId: string;
}

export function EventModal({ open, onOpenChange, event, onSave, eventTypes, churchId }: Props) {
  const [titulo, setTitulo] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (event) {
      setTitulo(event.titulo);
      setEventTypeId(event.eventTypeId);
      setDataInicio(event.dataInicio || event.data);
      setDataFim(event.dataFim || event.data);
      setDescricao(event.descricao || "");
    } else {
      setTitulo("");
      setEventTypeId(eventTypes[0]?.id || "");
      setDataInicio("");
      setDataFim("");
      setDescricao("");
    }
  }, [event, open, eventTypes]);

  const handleSubmit = () => {
    if (!titulo.trim() || !dataInicio || !dataFim || !eventTypeId) return;
    onSave({
      titulo: titulo.trim(),
      eventTypeId,
      data: dataInicio,
      dataInicio,
      dataFim: dataFim || dataInicio,
      diaInteiro: true,
      descricao: descricao.trim() || undefined,
      churchId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome do evento" />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Evento *</Label>
            <Select value={eventTypeId} onValueChange={setEventTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
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
              <Label>Data Início *</Label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Data Fim *</Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do evento" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!titulo.trim() || !dataInicio || !dataFim || !eventTypeId}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
