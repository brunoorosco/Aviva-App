import DashboardCells from './DashboardCells'
import DashboardChurch from './DashboardChurch'
import { useRouter } from 'next/router'

export default function Dashboard() {
  return (
    <div className='h-screen px-4 pb-24  md:px-6'>
      <DashboardCells />
    </div>
  )
}
