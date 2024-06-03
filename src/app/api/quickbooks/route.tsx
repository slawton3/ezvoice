import crypto from "crypto"
import { env } from "@/env"

export async function POST(req: Request) {
  try {
    console.log("POST request to /api/quickbooks/route.tsx")

    const webhookPayload = JSON.stringify(req.body)

    const signature = req.headers.get("intuit-signature")

    console.log("signature => ", signature)

    // const fields = ["realmId", "name", "id", "operation", "lastUpdated"]
    // const newLine = "\r\n"

    // if signature is empty return 401
    if (!signature) {
      return Response.json({ message: "Signature is missing" }, { status: 401 })
    }

    // if payload is empty, don't do anything
    if (!webhookPayload) {
      return Response.json({ message: "Payload is missing" }, { status: 400 })
    }

    const hash = crypto
      .createHmac("sha256", env.QUICKBOOKS_WEBHOOK_VERIFIER)
      .update(webhookPayload)
      .digest("base64")

    console.log("hash => ", hash, "\n", "signature => ", signature)

    if (signature !== hash) {
      return Response.json({ message: "Invalid Signature" }, { status: 401 })
    }

    // if signature is valid, print the payload

    console.log("payload => ", webhookPayload)
  } catch (error) {
    console.error(error)
  }
}
