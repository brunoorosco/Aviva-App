import React from 'react'
import { Icon } from '@/components/Icons'

export type Study = {
  name: string
  description: string
  link: string
  icon: string
}

async function getData() {
  const res = await fetch('localhost:3000/api/links')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default function Links() {
  //   useEffect(() => {
  //     axios
  //       .get('/api/escola-profeta/list')
  //       .then((res) => {
  //         setSubscriber(res.data)
  //       })
  //       .catch((err) => console.log(err))
  //   }, [])
  const data = getData()

  return (
    <>
      <div className='flex justify-center bg-gray-200'>
        <p className='my-2 text-2xl font-roboto'>Links de Acesso</p>
      </div>
      <div className='mx-5 mt-5 md:mx-64 md:mt-20 '>
        <div className='grid content-start grid-cols-1 gap-5 md:grid-cols-4'>
          {/* {resul?.map((subscriber: Study, key) => (
            <div key={key} className=''>
              <a
                href={subscriber.link}
                className='flex flex-col justify-center h-20 text-center border rounded-md shadow-md cursor-pointer md:h-28'
              >
                <div className='self-center'>
                  <Icon nameIcon={subscriber.icon} propsIcon={{ size: 20 }} />
                </div>
                <div className='mt-2'>{subscriber.name}</div>
              </a>
            </div>
          ))} */}
        </div>
      </div>
    </>
  )
}
