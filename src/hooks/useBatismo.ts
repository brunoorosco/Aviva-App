import { getBatismoService } from '@/infra/services/batismos'
import { useState, useTransition } from 'react'

export function useBatismosFetcher() {
  const [userDefault, setUserDefault] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [loading, startTransition] = useTransition()

  const fetchProfessionals = async (page = 1, limit = 10) => {
    startTransition(() => {
      const res = getBatismoService()
      console.log(res)
      setUserDefault(res)
    })
  }
  return { professionals: userDefault.data, total, loading, fetchProfessionals }
}
