"use client"

import Link from "next/link"

import { navigationMenuTriggerStyle } from "../ui/navigation-menu"

const HeaderLinks = () => {
  return (
    <div className="flex space-x-2">
      <Link
        href="/dashboard/integrations"
        className={navigationMenuTriggerStyle()}
      >
        Integrations
      </Link>
      <Link href="/dashboard/account" className={navigationMenuTriggerStyle()}>
        Pricing
      </Link>
    </div>
  )
}

export default HeaderLinks
