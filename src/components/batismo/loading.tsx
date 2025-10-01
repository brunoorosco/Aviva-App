// Show a loading indicator while the user data is being fetched
export default function LoadingPage() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-32 h-32 border-t-2 border-b-2 border-white rounded-full animate-spin'></div>
    </div>
  )
}
