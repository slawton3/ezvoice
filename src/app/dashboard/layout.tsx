import { redirect } from "next/navigation"

import { getCachedUser } from "@/lib/queries/user"
import { SidebarProvider } from "@/components/layouts/sidebar-provider"
import { SiteFooter } from "@/components/layouts/site-footer"

import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { DashboardSidebarSheet } from "./_components/dashboard-sidebar-sheet"

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getCachedUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <>
      <SidebarProvider>
        <div className="grid min-h-screen w-full lg:grid-cols-[17.5rem_1fr]">
          <DashboardSidebar className="top-0 z-30 hidden flex-col gap-4 border-r border-border/60 lg:sticky lg:block">
            <div></div>
          </DashboardSidebar>
          <div className="flex flex-col">
            <DashboardHeader user={user}>
              <DashboardSidebarSheet className="lg:hidden"></DashboardSidebarSheet>
            </DashboardHeader>
            <main className="flex-1 overflow-hidden px-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
      <SiteFooter />
    </>
  )
}
