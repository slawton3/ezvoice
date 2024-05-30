import { ErrorCard } from "@/components/cards/error-card"
import { Shell } from "@/components/shells/shell"

export default function IndustryNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Industry not found"
        description="The page you are looking for does not exist"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}
