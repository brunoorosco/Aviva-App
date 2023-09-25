import Card from '../Card'
import Header from '../Header'
import Heading1 from '../Header/Heading1'
import Calender from '../Calender'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

const Wrapper = ({ children }: Props) => {
  return <div className='flex flex-col w-full md:space-y-4'>{children}</div>
}

export default Wrapper
