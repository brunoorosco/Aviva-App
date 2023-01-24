import React, { useState } from 'react'
import MembrosTable from '../components/Tabela'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const Membros = (members) => {
  //const { data, error } = useSWR('/api/membros', fetcher)
  // console.log(members.user[0])
  const [membros, setMembros] = useState(members.user)

  return (
    <div>
      <div className="pt-6">
        <div className="container mx-auto text-center">
          <div className="flex justify-center">
            <MembrosTable> {membros} </MembrosTable>
          </div>
        </div>
      </div>
    </div>
  )
}

Membros.getInitialProps = async (ctx) => {
  const res = await fetch('http://localhost:3000/api/membros')
  const json = await res.json()
  // console.log(json)
  return { user: json.user }
}

export default Membros
