import { getCachedUser } from "@/lib/queries/user"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface SiteLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode
  }> {}

async function SiteLayout({ children, modal }: SiteLayoutProps) {
  const user = await getCachedUser()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        {children}
        {modal}
      </main>
      <SiteFooter />
    </div>
  )
}

export default SiteLayout
