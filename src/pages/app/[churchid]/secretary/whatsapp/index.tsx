import { useWhatsApp } from '@/hooks/useWhatsapp'
import { Suspense } from 'react'
import QRCode from 'qrcode.react'

export default function Home() {
  const { connect, isLoading, qrcode, error } = useWhatsApp()
  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        <div className='p-6 text-center bg-white rounded-lg shadow-lg'>
          <h1 className='mb-4 text-2xl font-semibold'>Conectar ao WhatsApp</h1>
          <button
            onClick={connect}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold mb-4`}
          >
            {isLoading ? 'Conectando...' : 'Iniciar Conexão'}
          </button>
          {qrcode && (
            <div className='mt-4'>
              <p className='text-lg font-semibold'>Escaneie o QR Code:</p>
              <QRCode value={qrcode} />
            </div>
          )}
          {/* {qrcode && (
            <div className='mt-4'>
              <p className='text-lg font-semibold'>Pairing Code:</p>
              <p className='text-3xl font-bold text-blue-600'>{qrcode}</p>
            </div>
          )} */}
          {/* {error && <p className='mt-4 text-red-500'>{error}</p>} */}
        </div>
      </Suspense>
    </div>
  )
}
