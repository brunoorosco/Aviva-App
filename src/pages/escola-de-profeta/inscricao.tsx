import React, { useState } from 'react'
import axios from 'axios'
import Toast from '../../components/Toast'
import Image from 'next/image'
import logo from '../../../public/logo-preto.png'
import TextInput from '../../components/Input'
import { Masks } from '../../utils/masks'
import Select from '../../components/Select'

const churchName = [
  { value: 'sede', label: 'Sede' },
  { value: 'guarulhos', label: 'Guarulhos' },
  { value: 'itaqua1', label: 'Itaqua I' },
  { value: 'sapopemba', label: 'Sapopemba' },
  { value: 'suzano', label: 'Suzano' },
  { value: 'itaqua2', label: 'Itaqua II' },
  { value: 'itu', label: 'Itu' },
  { value: 'curitiba', label: 'Curitiba' }
]

const Index = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    church: ''
  })

  async function handleSubmit(evt: any) {
    evt.preventDefault()
    try {
      const response = await axios.post('/api/escola-profeta/new', form)
      if (response.status === 201) {
        Toast.showSuccess(
          `${response.data.name}, sua inscrição foi realizada com sucesso!!!`
        )
        setForm({ name: '', email: '', phone: '', church: '' })
      }
    } catch (error) {
      Toast.showError('Não foi possível completar sua inscrição')
    }
  }

  return (
    <div className="md: w-full bg-gray-200 max-h-screen h-screen">
      <div className="justify-center text-center flex">
        <Image className="mt-5" alt="logo" src={logo} width={200} />
      </div>
      <div className="text-center pt-3">
        <p className="text-xl font-semibold">Inscrição escola de Profeta</p>
        <p className="text-base">Valor R$ 50,00</p>
        <p className="text-base">
          Pix para pagamentos CNPJ: 23.077.271/0001-40
        </p>
      </div>
      <form onSubmit={handleSubmit} id="form_escola">
        <div className="pt-6">
          <div className="container mx-auto text-center">
            <TextInput
              name="name"
              placeholder="Nome Completo"
              value={form.name}
              onChange={(value: string) =>
                setForm((currenty) => {
                  return {
                    ...currenty,
                    name: Masks.clearName(value).toUpperCase()
                  }
                })
              }
            />
            <TextInput
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(value: string) =>
                setForm((currenty) => {
                  return { ...currenty, email: value.toLowerCase() }
                })
              }
            />

            <TextInput
              placeholder="WhatsApp"
              name={'phone'}
              value={form.phone}
              onChange={(value: string) =>
                setForm((currenty) => {
                  return { ...currenty, phone: Masks.phone(value) }
                })
              }
            />
            <Select
              options={churchName}
              title={'Selecione sua Igreja'}
              value={form.church}
              onChange={(event: any) =>
                setForm((currenty) => {
                  return { ...currenty, church: event.target.value }
                })
              }
            />

            <div className="flex justify-center">
              <button
                className="p-4 block shadow bg-gray-500 my-2 rounded w-full max-w-md m-2 font-bold"
                type="submit"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Index
