interface Props {
  children: React.ReactNode
}

const Wrapper = ({ children }: Props) => {
  return <div className='flex flex-col w-full md:space-y-4'>{children}</div>
}

export default Wrapper
