import Link from "next/link"

import { getCachedUser } from "@/lib/queries/user"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page-header"
import { Shell } from "@/components/shell"

export async function Main() {
  const user = await getCachedUser()
  return (
    <Shell className="max-w-6xl">
      <PageHeader
        as="section"
        className="mx-auto items-center gap-2 text-center"
        withPadding
      >
        <PageHeaderHeading
          className=" animate-fade-up"
          style={{ animationDelay: "0.20s", animationFillMode: "both" }}
        >
          ClickUp Quickbooks Integration <br />
          <p className="text-primary">Made Simple</p>
        </PageHeaderHeading>
        <PageHeaderDescription
          className="max-w-[40.875rem] animate-fade-up"
          style={{ animationDelay: "0.30s", animationFillMode: "both" }}
        >
          Connect your ClickUp account with Quickbooks in minutes and start
          syncing your data.
        </PageHeaderDescription>
        <PageActions
          className="animate-fade-up"
          style={{ animationDelay: "0.40s", animationFillMode: "both" }}
        >
          <Link href="/signin" className={cn(buttonVariants())}>
            Get started
          </Link>
          <Link
            href="/dashboard/stores"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            See demo
          </Link>
        </PageActions>
      </PageHeader>

      {/* <ContentSection
        title="Technologies"
        description="This template comes pre-configured with the latest technologies"
        linkText="View all technologies"
        className="pt-8 md:py-10 lg:py-12"
        href="/tech"
        asChild
      >
        <Technologies />
      </ContentSection> */}
    </Shell>
  )
}
