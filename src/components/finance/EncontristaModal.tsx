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

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: TPeople) => void;
  encontrista?: TPeople | null;
}

export function EncontristaModal({ open, onClose, onSave, encontrista }: Props) {
  const [name, setName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [isento, setIsento] = useState(false);
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (encontrista) {
      setName(encontrista.nome);
      setTelefone(encontrista.telefone || "");
      setEmail(encontrista.email || "");
      setEndereco(encontrista.endereco || "");
      setIsento(encontrista.isento || false);
      setNascimento(encontrista.dataNascimento || "");
      setSexo(encontrista.sexo || "");
    } else {
      setName("");
      setTelefone("");
      setEmail("");
      setEndereco("");
      setIsento(false);
      setNascimento("");
      setSexo("");
    }
  }, [encontrista, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      nome: name.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      endereco: endereco.trim(),
      dataNascimento: nascimento,
      isento,
      sexo,
      rede: session?.user.cem,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{encontrista ? "Editar Encontrista" : "Novo Encontrista"}</DialogTitle>
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
          <div className="flex gap-2">
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
            <div className="space-y-1.5 w-full">
              <Label htmlFor="enc-end">Data de Nascimento</Label>
             <Input
                id="enc-nascimento"
                value={nascimento}
                type="date"
                onChange={(e) => setNascimento(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="enc-email">E-mail</Label>
            <Input
              id="enc-email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
            <div className="space-y-1.5">
              <Label htmlFor="enc-end">Sexo</Label>
              <RadioGroup value={sexo} onValueChange={setSexo} className="flex gap-10">
<div className="flex items-center gap-3">
                <RadioGroupItem value="masculino" id="masculino" />
    <Label htmlFor="option-one">Masculino</Label>
  </div>
  <div className="flex items-center gap-3">
                <RadioGroupItem value="feminino" id="feminino" />
    <Label htmlFor="option-two">Feminino</Label>
  </div>
              </RadioGroup>
              </div>
                
            
            <div className="space-y-1.5">
              <Label htmlFor="enc-end">Endereço</Label>
              <Input
                id="enc-end"
                placeholder="Rua, número, bairro"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
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
