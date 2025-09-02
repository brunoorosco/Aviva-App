'use cliente'
import ChurchFlowPage from '@/components/Flow'
import { useSession } from 'next-auth/react'

export default function ChurchFlow() {
  const { data: session } = useSession()
  return <ChurchFlowPage churchId={session?.user.churchId as string} />
}
