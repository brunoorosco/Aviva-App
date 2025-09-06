import { MemberCard } from '@/components/Member/MemberCard'
import Loading from '@/components/Select/loading'
import { Button } from '@/components/ui/button'
import { User } from '@/domain/models/users'
import { useHttpGet } from '@/hooks/api'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const MembersById = () => {
  const router = useRouter()
  const { query } = router
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cem._id as string

  const {
    data: member,
    error,
    isLoading
  } = useHttpGet<User>(
    `/api/protected/churches/${churchId}/cems/${cemId}/members/${query.memberId}`
  )

  if (error) return <p>Ocorreu um erro: {error.message}</p>
  if (isLoading) return <Loading />
  if (!member?.data) return <p>Membro não encontrado.</p>

  return (
    <div className='min-h-screen bg-gradient-bg p-2'>
      <div className='max-w-4xl mx-auto space-y-4'>
        <Button
          variant='ghost'
          className='flex items-center gap-2'
          onClick={() => router.back()}
        >
          <ArrowLeft className='w-4 h-4' />
          Voltar
        </Button>
        <MemberCard member={member.data} />
      </div>
    </div>
  )
}

export default MembersById
