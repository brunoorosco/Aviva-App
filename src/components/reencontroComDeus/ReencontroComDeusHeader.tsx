import Header from '@/components/Header/HeaderList'
import ImportButton from './ImportButton'
import { TPeople, TReencontroComDeus } from '@/domain/models/encontroComDeus'

type Props = {
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  encontro: TReencontroComDeus[]
}

const EncontroComDeusHeader = ({ pathname, inputFileRef, encontro }: Props) => {
  const mapReencontroToExport = (m: any) => {
    return {
      nome: m?.nome,
      rede: m?.rede,
      igreja: m?.igreja,
      idade: m?.idade,
      email: m?.email
    }
  }

  return (
    <Header<TReencontroComDeus>
      title='Reencontro com Deus'
      total={encontro.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={encontro}
      mapExport={mapReencontroToExport}
      sheetName='reencontro_com_Deus'
      filename='reencontro_com_Deus.xlsx'
      ImportComponent={""}
    />
  )
}

export default EncontroComDeusHeader
