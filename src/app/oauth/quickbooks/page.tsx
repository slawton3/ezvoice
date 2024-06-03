import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { integrationEnumSchema } from "@/db/schema"

import { addIntegration } from "@/lib/actions/integration"
import { qbOauthClient } from "@/lib/quickbooks"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

interface OauthSearchParams {
  code: string
  realmId: string
  state: string
}

interface OauthCallbackProps {
  searchParams: OauthSearchParams
}

export default async function OauthCallbackPage({
  searchParams,
}: OauthCallbackProps) {
  const heads = headers()

  const pathname = heads.get("x-url")

  console.log("The pathname is " + pathname)

  if (!pathname) {
    throw new Error("The pathname is not found")
  }
  const res = await qbOauthClient.createToken(pathname)

  const token = res.json
  const integration = await addIntegration({
    integration: integrationEnumSchema.Enum.quickbooks,
    refreshToken: token["refresh_token"] as string,
    accessToken: token["access_token"] as string,
  })

  if (integration) {
    redirect("/dashboard/integrations")
  }

  return (
    <Shell className="max-w-lg place-items-center">
      <Icons.spinner className="size-16 animate-spin" aria-hidden="true" />
    </Shell>
  )
}
