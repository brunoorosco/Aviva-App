import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'

interface IPost<T> {
  url: string
  data: T
}

interface IPatch<T> {
  url: string
  data: T
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

const useHttpPost = async <T>({ url, data }: IPost<T>) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

const useHttpPath = async <T>({ url, data }: IPatch<T>) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

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

export { useHttpDelete, useHttpPath, useHttpGet, useHttpPost }
