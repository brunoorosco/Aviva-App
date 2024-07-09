import { useRouter } from 'next/router'
import { NextPage } from 'next'

const ErrorPage: NextPage = () => {
  const router = useRouter()
  const { message } = router.query

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{message || 'An unexpected error occurred.'}</p>
      <button onClick={() => router.push('/')}>Go back to Home</button>
    </div>
  )
}

export default ErrorPage
