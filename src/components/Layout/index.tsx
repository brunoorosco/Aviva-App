import Sidebar from '../Sidebar'
import Wrapper from '../Wrapper'

const Layout = () => {
  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <Sidebar />
        <Wrapper />
      </div>
    </main>
  )
}

export default Layout
