import React, { useState } from 'react'
import MembrosTable from '../../components/Tabela'
import { GetServerSideProps, NextPage } from 'next'

type Member = {
  id: string
  name: string
  email?: string
  phone?: string
  [key: string]: any
}

type MembrosProps = {
  user: Member[]
}

const Membros: NextPage<MembrosProps> = ({ user }) => {
  const [membros, setMembros] = useState<Member[]>(user)

  return (
    <div className="pt-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <MembrosTable data={membros} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/membros')
  const json = await res.json()
  return { props: { user: json.user } }
}

export default Membros
