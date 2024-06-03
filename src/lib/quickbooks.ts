import { env } from "@/env"
import OAuthClient from "intuit-oauth"

export const qbOauthClient = new OAuthClient({
  clientId: env.INTUIT_OAUTH_CLIENT_ID,
  clientSecret: env.INTUIT_OAUTH_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: env.INTUIT_REDIRECT_URI,
})

export const qbOauthOptions = {
  scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
  state: "testState",
}
