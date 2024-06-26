import React from "react"

import { getCachedUser } from "@/lib/queries/user"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

export default async function SiteLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getCachedUser()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
