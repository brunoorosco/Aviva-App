import { Suspense } from 'react'
import QRCode from 'qrcode.react'

export default function Home() {
  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        <div className='p-6 text-center bg-white rounded-lg shadow-lg'>
          <h1 className='mb-4 text-2xl font-semibold'>Conectar ao WhatsApp</h1>
        </div>
      </Suspense>
    </div>
  )
}
