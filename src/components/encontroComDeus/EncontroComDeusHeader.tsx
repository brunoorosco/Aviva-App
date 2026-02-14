import Header from "@/components/Header/HeaderList";
import { TEncontroComDeus } from "@/domain/models/encontroComDeus";

type Props = {
  pathname: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
  encontro: TEncontroComDeus[];
};

const EncontroComDeusHeader = ({ pathname, inputFileRef, encontro }: Props) => {
  const mapReencontroToExport = (m: any) => {
    return {
      nome: m?.nome,
      rede: m?.rede,
      igreja: m?.igreja,
      idade: m?.idade,
      email: m?.email,
      equipe: m?.equipe,
    };
  };

  return (
    <Header<TEncontroComDeus>
      title="Encontro com Deus"
      total={encontro.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={encontro}
      mapExport={mapReencontroToExport}
      sheetName="encontro_com_Deus"
      filename="encontro_com_Deus.xlsx"
      ImportComponent={""}
    />
  );
};

export default EncontroComDeusHeader;
