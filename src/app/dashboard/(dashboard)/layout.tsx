import { Navbar } from './_components/navbar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='h-[calc(100dvh)] flex flex-col md:flex-row-reverse'>
      <div className='flex-grow flex flex-col items-center justify-start gap-8 overflow-y-scroll'>
        {children}
      </div>
      <Navbar />
    </div>
  )
}
