import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Churches } from '@prisma/client'
import { useHttpGet } from '@/hooks/api'
// import Skeleton from '@/components/Skeleton'

const IndexApp = () => {
  const router = useRouter()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const { data: session } = useSession()

  const {
    data: churches,
    error,
    isLoading
  } = useHttpGet<Churches>(`/api/protected/app/${session?.user?.email}`)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (error) {
      console.error('Erro:', error)
      return
    }

    if (churches) {
      setShouldRedirect(true)
    }
  }, [churches, isLoading, error])

  useEffect(() => {
    if (shouldRedirect === true && churches) {
      setTimeout(() => {
        router.push(`/app/${session?.user.churchId}`)
      }, 1000)
      setShouldRedirect(false)
    }
  }, [shouldRedirect, churches, router])

  // if (isLoading) {
  //   return <Skeleton />
  // }
  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }
}

export default IndexApp
