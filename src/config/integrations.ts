import { integrationEnumSchema } from "@/db/schema/integrations"

export interface Integration {
  id: string
  title: string
  description: string
  logo: string
}

export const integrations = [
  {
    id: integrationEnumSchema.Enum.clickup,
    title: "ClickUp",
    description:
      "ClickUp is a productivity platform that allows you to manage your work and personal tasks.",
    logo: "/images/clickup-logo.png",
  },
  {
    id: integrationEnumSchema.Enum.quickbooks,
    title: "Quickbooks",
    description:
      "Quickbooks is an accounting software that helps you manage your finances.",
    logo: "/images/quickbooks-logo.png",
  },
]
