import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function IntegrationsSkeleton() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className={cn("flex flex-col", {
            "sm:col-span-2 lg:col-span-1": i === 2,
          })}
        >
          <CardHeader className="flex-1 space-y-2.5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="grid flex-1 place-items-start gap-6">
            <Skeleton className="h-7 w-40" />
            <div className="w-full space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton
                    className={cn("h-4 w-1/4", i % 2 === 0 && "w-2/5")}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Skeleton className="h-10 w-1/3" />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
