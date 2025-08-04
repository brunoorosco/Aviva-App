import { baptism } from '@/domain/models/baptism'
import Header from '@/components/Header/HeaderList'
import ImportButton from './ImportButton'

type Props = {
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  batismo: baptism[]
}

const BatismoHeader = ({ pathname, inputFileRef, batismo }: Props) => {
  const mapBaptismToExport = (m: baptism) => ({
    nome: m.data,
    rede: m.batizandos,
    churchId: m.churchId
  })

  return (
    <Header<baptism>
      title='Batismos'
      total={batismo.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={batismo}
      mapExport={mapBaptismToExport}
      sheetName='Batismo'
      filename='batismo.xlsx'
      ImportComponent={<ImportButton inputFileRef={inputFileRef} />}
    />
  )
}

export default BatismoHeader
