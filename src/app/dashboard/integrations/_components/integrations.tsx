"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  IntegrationEnum,
  integrationEnumSchema,
  IntegrationSelectSchema,
} from "@/db/schema"

import { integrations } from "@/config/integrations"
import { getClickupClientUrl } from "@/lib/actions/clickup"
import {
  generateAuthorizationUrl,
  revokeQuickbooksToken,
} from "@/lib/actions/quickbooks"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface IntegrationsProps {
  integrationsData: IntegrationSelectSchema[] | null
}

export function Integrations({ integrationsData }: IntegrationsProps) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState<IntegrationEnum | null>(null)
  if (!integrationsData) return null

  const onConnectClick = async (id: IntegrationEnum) => {
    try {
      setIsPending(id)
      switch (id) {
        case integrationEnumSchema.Enum.quickbooks:
          const url = await generateAuthorizationUrl()
          router.push(url)
          break
        case integrationEnumSchema.Enum.clickup:
          const uri = await getClickupClientUrl()
          router.push(uri)
          break
        default:
          break
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(null)
    }
  }

  const disconnectIntegration = async (id: IntegrationEnum) => {
    try {
      setIsPending(id)
      switch (id) {
        case integrationEnumSchema.Enum.quickbooks:
          await revokeQuickbooksToken()
          break
        case integrationEnumSchema.Enum.clickup:
          // const clickupClient.code.getUri();

          break
        default:
          break
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(null)
    }
  }

  const getIsConnected = (id: IntegrationEnum) => {
    return integrationsData.some((item) => item.name === id)
  }

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {integrations.map((item, i) => (
        <Card key={item.title} className="flex flex-col">
          <CardHeader className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              {item.title}{" "}
              {getIsConnected(item.id) && (
                <Button variant={"link"} disabled>
                  (Connected)
                </Button>
              )}
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid flex-1 place-items-start gap-6">
            <Image
              src={item.logo}
              alt={item.title}
              width={200}
              height={200}
              className="rounded-lg"
            />
          </CardContent>
          <CardFooter className="pt-4">
            {getIsConnected(item.id) ? (
              <Button
                variant="link"
                className="flex items-center gap-1 text-destructive"
                disabled={isPending === item.id}
                onClick={() => disconnectIntegration(item.id)}
              >
                {isPending === item.id && (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                )}
                <span>Disconnect</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex items-center gap-1"
                disabled={isPending === item.id}
                onClick={() => onConnectClick(item.id)}
              >
                {isPending === item.id && (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                )}
                Connect
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
