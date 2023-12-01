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
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  console.log(res)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
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
  console.log(data)
  return (
    <>
      <div className='flex justify-center bg-gray-200'>
        <p className='my-2 font-roboto text-2xl'>Links de Acesso</p>
      </div>
      <div className='md:mx-64 md:mt-20 mx-5 mt-5 '>
        <div className='grid md:grid-cols-4 grid-cols-1  gap-5 content-start'>
          {/* {resul?.map((subscriber: Study, key) => (
            <div key={key} className=''>
              <a
                href={subscriber.link}
                className='border rounded-md text-center justify-center flex-col flex cursor-pointer md:h-28 h-20 shadow-md'
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
