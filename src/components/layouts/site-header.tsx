import type { User } from "@clerk/nextjs/server"

import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"

import { Separator } from "../ui/separator"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* <AuthDropdown user={user} /> */}
          </nav>
        </div>
      </div>
      <Separator />
    </header>
  )
}
