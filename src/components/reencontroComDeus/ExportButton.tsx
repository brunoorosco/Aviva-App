import * as XLSX from "xlsx";
import { TReencontroComDeus, TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { Download } from "lucide-react";

type Props = {
  reencontro: TReencontroComDeus;
};

const ExportButton = ({ reencontro }: Props) => {
  const handleExport = () => {
    if (!reencontro) return;

    // Preparar dados dos reencontristas
    const reencontristasData = (reencontro.reencontristas || []).map((e: TPeople) => ({
      Tipo: "Reencontrista",
      Nome: e.nome,
      Email: e.email || "",
      Telefone: e.telefone || "",
      Rede: typeof e.rede === "object" ? e.rede?.name : "",
      Igreja: e.igreja || "",
      Idade: e.idade || "",
      Sexo: e.sexo || "",
      Endereço: e.endereco || "",
      Bairro: e.bairro || "",
      Isento: e.isento ? "Sim" : "Não",
      DataNascimento: e.dataNascimento || "",
    }));

    // Preparar dados da equipe
    const equipeData = (reencontro.equipe || []).map((e: TEquipe) => ({
      Tipo: "Equipe",
      Nome: e.name,
      Email: "",
      Telefone: "",
      Rede: e.rede?.name || "",
      Igreja: "",
      Idade: "",
      Sexo: "",
      Endereço: "",
      Bairro: "",
      Isento: e.isento ? "Sim" : "Não",
      DataNascimento: "",
    }));

    // Combinar todos os dados
    const allData = [...reencontristasData, ...equipeData];

    // Criar workbook e worksheet
    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    
    // Adicionar sheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");
    
    // Gerar nome do arquivo com número e data do reencontro
    const fileName = `Reencontro_${reencontro.numero}_${new Date(reencontro.data).toISOString().split("T")[0]}.xlsx`;
    
    // Fazer download do arquivo
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="
        px-3 py-1.5
        bg-purple-600 hover:bg-purple-700
        text-white text-xs font-medium
        rounded-md shadow-sm hover:shadow-md
        flex items-center gap-1.5
        transition-all duration-200
        active:scale-95
      "
      aria-label="Exportar Dados"
      title="Exportar Equipe e Reencontristas para Excel"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Exportar</span>
    </button>
  );
};

export default ExportButton;
