import React, { useEffect, useState } from 'react'
import { Icon } from '@/components/Icons'
import { useHttpGet } from '@/hooks/api'

export type Links = {
  name: string
  description: string
  link: string
  icon: string
}

const Links = () => {
  const [links, setLinks] = useState<Links[]>()
  const { data } = useHttpGet('/api/links')

  useEffect(() => {
    setLinks(data?.data)
  }, [data])

  return (
    <>
      <div className='flex justify-center bg-gray-200'>
        <p className='my-2 text-2xl font-roboto'>Links de Acesso</p>
      </div>
      <div className='mx-5 mt-5 md:mx-64 md:mt-20 '>
        <div className='grid content-start grid-cols-1 gap-5 md:grid-cols-4'>
          {links?.map((subscriber: Links, key: number) => (
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
          ))}
        </div>
      </div>
    </>
  )
}

export default Links

const list = [
  {
    nameLink: 'Reencontro com Deus e Seja Livre',
    link: 'https://docs.google.com/spreadsheets/d/1ScwuKFgJ-r5qN-N9Juzi41TKQoHybOcb/edit?usp=sharing&ouid=105537810337756421322&rtpof=true&sd=true',
    icon: 'FaCross'
  },
  {
    nameLink: 'Casas e Visitas de Paz',
    link: 'https://forms.gle/5EYd3GQEQjhK7WUG6',
    icon: 'FaHands'
  },
  {
    nameLink: 'Encontro com Deus',
    link: 'https://forms.gle/WNEtJUXF7t6c4WDy8',
    icon: 'FaPray'
  },
  {
    nameLink: 'Cadastro dos Encontristas',
    link: 'https://docs.google.com/spreadsheets/d/1hldjBO0ob5V1u1Q-j8GYBBl68KJjXNFjUH_LlJo4j0o/edit?usp=sharing',
    icon: 'FaUsers'
  },
  {
    nameLink: 'Inscrição - Batismo nas Águas',
    link: 'https://forms.gle/wzxC7c5te4JMvzWb6',
    icon: 'FaChessKing'
  },
  {
    nameLink: 'Lista de Batizandos',
    link: 'https://docs.google.com/spreadsheets/d/1OzKZTsSF-zFLmVPDhx6G9N3lMuuxj8Di5XuE4SOvXxk/edit?usp=sharing',
    icon: 'FaUsers'
  }
]
