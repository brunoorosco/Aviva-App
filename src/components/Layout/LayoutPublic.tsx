import SignIn from '@/components/SignIn'
import Seo from '../Seo'

interface Props {
  children: React.ReactNode
}

const LayoutPublic = ({ children }: Props) => {
  return (
    <>
      <Seo title='Aviva-App' />
      <SignIn />
    </>
  )
}

export default LayoutPublic
