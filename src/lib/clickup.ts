import { env } from "@/env"
import ClientOAuth2 from "client-oauth2"

export const clickupClient = new ClientOAuth2({
  clientId: env.CLICKUP_CLIENT_ID,
  clientSecret: env.CLICKUP_CLIENT_SECRET,
  redirectUri: env.CLICKUP_REDIRECT_URI,
  accessTokenUri: `https://app.clickup.com/api/v2/oauth/token?`,
})
