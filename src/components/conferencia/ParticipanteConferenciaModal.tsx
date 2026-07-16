import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TPeople } from "@/domain/models/encontroComDeus";
import { Masks } from "@/utils/masks";
import { useSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { TParticipante } from "@/domain/models/conferencia";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (data: TPeople) => void;
    participante?: TParticipante | null;
}

export function ParticipanteModal({ open, onClose, onSave, participante }: Props) {
    const [name, setName] = useState("");
    const [telefone, setTelefone] = useState("");
    const [isento, setIsento] = useState(false);
    const [sexo, setSexo] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        if (participante) {
            setName(participante.nome);
            setTelefone(participante.telefone || "");
            setIsento(participante.isento || false);
            setSexo(participante.sexo || "");
        } else {
            setName("");
            setTelefone("");
            setIsento(false);
            setSexo("");
        }
    }, [participante, open]);

    const handleSave = () => {
        if (!name.trim()) return;
        if (!sexo) return;
        onSave({
            nome: name.trim(),
            telefone: telefone.trim(),
            isento,
            sexo,
            rede: {
                name: session?.user.cem,
                _id: session?.user.id
            } as any,
        });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{participante ? "Editar Participante" : "Novo Participante"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="enc-name">Nome *</Label>
                        <Input
                            id="enc-name"
                            placeholder="Nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label htmlFor="enc-tel">Telefone</Label>
                        <Input
                            id="enc-tel"
                            placeholder="(00) 00000-0000"
                            value={telefone}
                            onChange={(e) => {
                                const masked = Masks.phone(e.target.value);
                                setTelefone(masked);
                            }}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="enc-sexo">Sexo</Label>
                        <RadioGroup value={sexo} onValueChange={setSexo} className="flex gap-10" required>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="masculino" id="masculino" />
                                <Label htmlFor="masculino">Masculino</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="feminino" id="feminino" />
                                <Label htmlFor="feminino">Feminino</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="enc-isento"
                            checked={isento}
                            onCheckedChange={(v) => setIsento(v === true)}
                        />
                        <Label htmlFor="enc-isento" className="cursor-pointer">
                            Isento de pagamento
                        </Label>

                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim()}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
