import useSWR from 'swr'
import axios from 'axios'

interface Member {
  _id: string
  name: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function useMembers(churchId: string, query: string) {
  const shouldFetch = query.length > 1
  const { data, error, isLoading } = useSWR<Member[]>(
    shouldFetch
      ? `/api/protected/churches/${churchId}/users/members?name=${query}`
      : null,
    fetcher
  )

  return {
    members: data ?? [],
    isLoading,
    isError: error
  }
}
