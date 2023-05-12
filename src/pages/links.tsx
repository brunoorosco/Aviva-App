import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
      <div className="flex justify-center">
        <p className="mt-2 text-2xl">Links de Acesso</p>
      </div>
      <div className="mx-64 mt-20">
        <div className="grid grid-cols-4 gap-5 content-start">
          {list?.map((subscriber: Study, key) => (
            <div key={key} className="">
              <a
                href={subscriber.link}
                className="border rounded-md text-center flex-col flex cursor-pointer h-28 shadow-md"
              >
                <div className="">Icon</div>
                <div>{subscriber.nameLink}</div>
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
    nameLink: 'Escola de Profeta',
    link: 'https://docs.google.com/spreadsheets/d/1ScwuKFgJ-r5qN-N9Juzi41TKQoHybOcb/edit?usp=sharing&ouid=105537810337756421322&rtpof=true&sd=true',
    icon: ''
  },
  {
    nameLink: 'Casas e Visitas de Paz',
    link: 'https://forms.gle/5EYd3GQEQjhK7WUG6',
    icon: ''
  },
  {
    nameLink: 'Batismo nas águas',
    link: 'https://forms.gle/wzxC7c5te4JMvzWb6',
    icon: 'brunoorosco@gmail.com'
  },
  {
    nameLink: 'Batismo nas águas',
    link: 'https://forms.gle/wzxC7c5te4JMvzWb6',
    icon: 'brunoorosco@gmail.com'
  },
  {
    nameLink: 'Batismo nas águas',
    link: 'https://forms.gle/wzxC7c5te4JMvzWb6',
    icon: 'brunoorosco@gmail.com'
  }
]
