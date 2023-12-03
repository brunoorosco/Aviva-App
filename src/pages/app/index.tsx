import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
// import Skeleton from '@/components/Skeleton'

const IndexApp = () => {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    !session?.user.churchId
      ? router.push(`/app/tenant`)
      : router.push(`/app/${session?.user.churchId}`)
  }, [router])
}

export default IndexApp
