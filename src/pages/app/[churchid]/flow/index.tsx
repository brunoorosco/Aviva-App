import ChurchFlowPage from '@/presentation/pages/flow'
import { useParams } from 'next/navigation'

export default function FlowPage() {
  const params = useParams()
  const churchId = params.churchid as string

  return <ChurchFlowPage churchId={churchId} />
}
