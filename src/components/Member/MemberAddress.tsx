import { AddressModel } from '@/domain/models/address'

type Props = {
  address?: AddressModel
}

const MemberAddress = ({ address }: Props) => {
  const main = address
  const fullAddress = main
    ? `${main.street || ''}, ${main.number || ''} - ${main.city || ''}`
    : ''

  return (
    <p className='text-sm text-gray-500 uppercase truncate dark:text-gray-400'>
      {fullAddress}
    </p>
  )
}

export default MemberAddress
