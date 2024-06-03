import { headers } from "next/headers"
import { AlertCircleIcon } from "lucide-react"

import { addClickupIntegration } from "@/lib/actions/clickup"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

interface OauthSearchParams {
  code: string
  state: string
}

interface OauthCallbackProps {
  searchParams: OauthSearchParams
}

export default async function OauthCallbackPage({
  searchParams,
}: OauthCallbackProps) {
  const url = headers().get("x-url")

  if (!url) {
    return (
      <Shell className="max-w-lg place-items-center">
        <AlertCircleIcon className="size-16 text-red-500" aria-hidden="true" />
        <p className="text-red-500">Missing URL</p>
      </Shell>
    )
  }

  const token = await addClickupIntegration(url)

  console.log(token)

  return (
    <Shell className="max-w-lg place-items-center">
      <Icons.spinner className="size-16 animate-spin" aria-hidden="true" />
    </Shell>
  )
}
