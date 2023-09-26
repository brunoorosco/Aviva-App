import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useSession } from 'next-auth/react'

const IndexApp = () => {
  const router = useRouter()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const { data: session } = useSession()

  //@ts-ignore
  const churches = session?.user?.UserCEM[0].cem.ChurchesCEM[0].churches

  useEffect(() => {
    if (churches) {
      setShouldRedirect(true)
    }
  }, [churches])

  useEffect(() => {
    if (shouldRedirect === true && churches) {
      setTimeout(() => {
        router.push(`/app/${churches?.id}`)
      }, 1000)
      setShouldRedirect(false)
    }
  }, [shouldRedirect, churches, router])

  return (
    <div className='max-w-lg mx-auto text-center my-6'>
      {session?.user?.image && (
        <div className='relative rounded-full h-16 w-16 inline-block'>
          <Image
            src={session?.user?.image}
            alt={session?.user?.name ?? 'Avatar'}
          />
        </div>
      )}
      <h1>{session?.user?.name}</h1>
      <div className='mt-6'>
        {churches &&
          churches.length > 1 &&
          churches.map((church: any) => {
            return (
              <Link
                key={church.id}
                href={`/app/${church.id}`}
                className='inline-block w-full text-center border text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 px-4 py-2'
              >
                {church.name}
              </Link>
            )
          })}
      </div>
      {churches?.length === 1 && (
        <div>
          <button
            type='button'
            className='py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            loading
          </button>
        </div>
      )}
    </div>
  )
}

export default IndexApp
