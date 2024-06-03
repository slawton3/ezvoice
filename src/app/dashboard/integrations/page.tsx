import React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"

import { getIntegrations } from "@/lib/queries/integration"
import { getCachedUser } from "@/lib/queries/user"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page-header"
import { Shell } from "@/components/shell"

import { Integrations } from "./_components/integrations"
import { IntegrationsSkeleton } from "./_components/integrations-skeleton"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Integrations",
  description: "Manage your Integrations and subscription plan",
}

export default async function IntegrationsPage() {
  const user = await getCachedUser()

  if (!user) {
    redirect("/signin")
  }

  const integrations = await getIntegrations()

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Integrations</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your integrations here
        </PageHeaderDescription>
      </PageHeader>
      <React.Suspense fallback={<IntegrationsSkeleton />}>
        <Integrations integrationsData={integrations} />
      </React.Suspense>
    </Shell>
  )
}
