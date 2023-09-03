import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Icon } from '@/components/Icons'

export type Study = {
  nameLink: string
  link: string
  icon: string
}

const ListaEscolaProfeta = () => {
  const [subscribers, setSubscriber] = useState<Study[]>()

  useEffect(() => {
    axios
      .get('/api/escola-profeta/list')
      .then((res) => {
        setSubscriber(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <div className="flex justify-center bg-gray-200">
        <p className="my-2 font-roboto text-2xl">Links de Acesso</p>
      </div>
      <div className="md:mx-64 md:mt-20 mx-5 mt-5 ">
        <div className="grid md:grid-cols-4 grid-cols-1  gap-5 content-start">
          {list?.map((subscriber: Study, key) => (
            <div key={key} className="">
              <a
                href={subscriber.link}
                className="border rounded-md text-center justify-center flex-col flex cursor-pointer md:h-28 h-20 shadow-md"
              >
                <div className="self-center">
                  <Icon nameIcon={subscriber.icon} propsIcon={{ size: 20 }} />
                </div>
                <div className="mt-2">{subscriber.nameLink}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ListaEscolaProfeta

const list = [
  {
    nameLink: 'Lista de Batizandos',
    link: '/sede/batismo',
    icon: 'FaCross'
  },
  {
    nameLink: 'Aceitou Jesus',
    link: '/sede/aceitou-jesus',
    icon: 'FaCross'
  }
]
