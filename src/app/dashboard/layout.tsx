import { UserMenu } from './leaderboard/_components/user-menu'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <UserMenu />
    </>
  )
}
