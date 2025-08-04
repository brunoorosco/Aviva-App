import Header from '@/components/Header/HeaderList'
import ImportButton from './ImportButton'
import { TEncontroComDeus } from '@/domain/models/encontroComDeus'

type Props = {
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  encontro: TEncontroComDeus[]
}

const EncontroComDeusHeader = ({ pathname, inputFileRef, encontro }: Props) => {
  const mapBaptismToExport = (m: TEncontroComDeus) => ({
    nome: m.data,
    rede: m.encontristas,
    churchId: m.churchId
  })

  return (
    <Header<TEncontroComDeus>
      title='Encontro com Deus'
      total={encontro.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={encontro}
      mapExport={mapBaptismToExport}
      sheetName='encontro_com_Deus'
      filename='encontro_com_Deus.xlsx'
      ImportComponent={<ImportButton inputFileRef={inputFileRef} />}
    />
  )
}

export default EncontroComDeusHeader
