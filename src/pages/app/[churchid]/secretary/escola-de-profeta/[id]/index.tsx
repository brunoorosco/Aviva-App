import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Download } from 'lucide-react'

export default function PageEscolaProfetraById() {
  const students = [
    {
      name: 'Sophia Clark',
      lessons: ['Present', 'Present', 'Absent', 'Present'],
      status: 'Completed'
    },
    {
      name: 'Ethan Carter',
      lessons: ['Present', 'Absent', 'Present', 'Present'],
      status: 'Completed'
    },
    {
      name: 'Olivia Bennett',
      lessons: ['Absent', 'Present', 'Present', 'Absent'],
      status: 'In Progress'
    },
    {
      name: 'Liam Foster',
      lessons: ['Present', 'Present', 'Present', 'Present'],
      status: 'Completed'
    },
    {
      name: 'Ava Harper',
      lessons: ['Absent', 'Absent', 'Absent', 'Absent'],
      status: 'In Progress'
    }
  ]

  const getBadge = (value: string) => {
    switch (value) {
      case 'Present':
        return (
          <Badge variant='outline' className='text-green-800 bg-green-100'>
            {value}
          </Badge>
        )
      case 'Absent':
        return (
          <Badge variant='outline' className='text-red-800 bg-red-100'>
            {value}
          </Badge>
        )
      case 'Completed':
        return (
          <Badge variant='outline' className='text-blue-800 bg-blue-100'>
            {value}
          </Badge>
        )
      case 'In Progress':
        return (
          <Badge variant='outline' className='text-yellow-800 bg-yellow-100'>
            {value}
          </Badge>
        )
      default:
        return <Badge variant='secondary'>{value}</Badge>
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='flex items-center justify-between px-10 py-3 bg-white border-b border-gray-200'>
        <div className='flex items-center gap-2'>
          <div className='text-blue-600 size-6'>
            <svg fill='currentColor' viewBox='0 0 48 48'>
              <path d='M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z' />
            </svg>
          </div>
          <h2 className='text-lg font-bold'>Course Platform</h2>
        </div>
        <nav className='flex items-center gap-2'>
          <Button variant='ghost'>Home</Button>
          <Button className='text-white bg-blue-600 hover:bg-blue-700'>
            Courses
          </Button>
          <Button variant='ghost'>Students</Button>
          <Button variant='ghost'>Reports</Button>
          <div
            className='ml-6 bg-center bg-cover rounded-full size-10'
            style={{
              backgroundImage:
                'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDcVY0lxn7LJNVMkn2Yg0fRbE2qX6ZQHVQnj0bzmrD1J7QiYItszFzWP6kJ-gNtc-nNyPi-ap8V_hHxALNOjivTMu7sADl1GPs9BWK-XOlm73Xs89Moj4kNZq7MDTh2dna7bU7tcbF-OUCquzzs1_5bXlIRvjduVKtquNX_JQqPv3cobKsCr2qME0NU3mjwLO0aGpDMmhuUldFdih4qNg_CLE0YXo1E-DlJWVP3DUh4OB92lKHabpo9Jwqxp69mTzofYSONd9OidkU)'
            }}
          />
        </nav>
      </header>

      {/* Main */}
      <main className='flex justify-center flex-1 px-10 py-8'>
        <div className='flex flex-col w-full max-w-6xl gap-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Module Attendance</h1>
              <p className='text-gray-500'>
                Track student attendance for the 'Advanced Data Analysis'
                module.
              </p>
            </div>
            <Button className='text-white bg-blue-600 hover:bg-blue-700'>
              <Download className='w-4 h-4 mr-2' /> Export Data
            </Button>
          </div>

          {/* Module Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Module Overview</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
              <div>
                <p className='text-gray-500'>Module Name</p>
                <p className='font-medium'>Advanced Data Analysis</p>
              </div>
              <div>
                <p className='text-gray-500'>Start Date</p>
                <p className='font-medium'>2024-01-15</p>
              </div>
              <div>
                <p className='text-gray-500'>End Date</p>
                <p className='font-medium'>2024-03-15</p>
              </div>
            </CardContent>
          </Card>

          {/* Student Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className='text-center'>Lesson 1</TableHead>
                    <TableHead className='text-center'>Lesson 2</TableHead>
                    <TableHead className='text-center'>Lesson 3</TableHead>
                    <TableHead className='text-center'>Lesson 4</TableHead>
                    <TableHead className='text-center'>Final Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, i) => (
                    <TableRow key={i}>
                      <TableCell className='font-medium'>
                        {student.name}
                      </TableCell>
                      {student.lessons.map((lesson, idx) => (
                        <TableCell className='text-center' key={idx}>
                          {getBadge(lesson)}
                        </TableCell>
                      ))}
                      <TableCell className='text-center'>
                        {getBadge(student.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
