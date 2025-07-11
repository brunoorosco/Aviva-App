import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'

interface IPost<T> {
  url: string
  data: T
  headers?: { [key: string]: string }
}

interface IPatch<T> {
  url: string
  data: Partial<T> // Para PATCH faz sentido ser parcial, PUT geralmente é completo
}

interface IDelete {
  url: string
}
interface IResponseData<T> {
  data: T
  headers: Record<string, any>
}

const fetcher = async <T = any>(url: string) => {
  const response: IResponseData<T> = await axios.get(url)
  return { data: response.data, headers: response.headers }
}

const useHttpGet = <T = any>(url: string) => {
  return useSWR<IResponseData<T>, Error>(url, fetcher)
}

const useHttpPost = async <T>({ url, data, headers }: IPost<T>) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

const useHttpPatch = async <T>({ url, data }: IPatch<T>) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  return res.json()
}

const useHttpPut = async <T>({ url, data }: IPatch<T>) => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  return res.json()
}

const useHttpDelete = async ({ url }: IDelete) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })

  return res.json()
}

export { useHttpDelete, useHttpPatch, useHttpGet, useHttpPost, useHttpPut }
