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

const fetcher = async (url: string) => {
  const response = await axios.get(url)
  return response.data
}

const useHttpGet = <T = any>(url: string) => {
  return useSWR<T>(url, fetcher)
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

const executePatch = async <T>({ url, data }: IPatch<T>) => {
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

export { useHttpDelete, executePatch, useHttpGet, useHttpPost }
