import { useCallback, useEffect, useState } from 'react'
import { CultoDomingo, DEFAULT_CULTO_DOMINGO } from '@/domain/models/cultoSettings'

type UseCultoSettingsResult = {
  cultoDomingo: CultoDomingo
  loading: boolean
  save: (value: CultoDomingo) => Promise<boolean>
}

/**
 * Carrega e mantém a configuração de culto de domingo da igreja.
 * - GET /api/protected/churches/{churchId}/culto
 * - POST /api/protected/churches/{churchId}/culto  (apenas admin)
 *
 * Usado pela tela de Configurações (admin) e pelos forms de Apresentação.
 */
export function useCultoSettings(churchId?: string): UseCultoSettingsResult {
  const [cultoDomingo, setCultoDomingo] = useState<CultoDomingo>(DEFAULT_CULTO_DOMINGO)
  const [loading, setLoading] = useState(true)

  const fetchConfig = useCallback(async () => {
    if (!churchId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`/api/protected/churches/${churchId}/culto`)
      if (res.ok) {
        const data: { cultoDomingo?: CultoDomingo } = await res.json()
        if (data.cultoDomingo === 'manha' || data.cultoDomingo === 'noite' || data.cultoDomingo === 'manha_e_noite') {
          setCultoDomingo(data.cultoDomingo)
        } else {
          setCultoDomingo(DEFAULT_CULTO_DOMINGO)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de culto:', error)
    } finally {
      setLoading(false)
    }
  }, [churchId])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const save = useCallback(async (value: CultoDomingo) => {
    if (!churchId) return false
    try {
      setLoading(true)
      const res = await fetch(`/api/protected/churches/${churchId}/culto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cultoDomingo: value }),
      })
      if (res.ok) {
        setCultoDomingo(value)
        return true
      }
      const error: { error?: string } = await res.json().catch(() => ({}))
      alert(error.error || 'Erro ao salvar configuração')
      return false
    } catch (error) {
      console.error('Erro ao salvar configuração de culto:', error)
      alert('Erro ao salvar configuração. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [churchId])

  return { cultoDomingo, loading, save }
}