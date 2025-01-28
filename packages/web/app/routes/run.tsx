import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/run";
import { getRunEventsByRunId } from "~/lib/data";

export async function loader({ params }: Route.LoaderArgs) {
    const runEvents = await getRunEventsByRunId(Number(params.runId))

    return runEvents
  }

export default function Run({
    params,
    loaderData
}: Route.ComponentProps) {
    params.runId;

    

    return (
        <Card className={cn("")}>
            <CardHeader>
                <CardTitle>Run Recording</CardTitle>
                <CardDescription>Started 2 hours ago. ✅ Success. Duration: 1:22</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">


                <video controls width={"100%"}>
                    <source src="/media/cc0-videos/flower.webm" type="video/webm" />
                </video>


                <div>
                    {loaderData.map((event, index) => (
                        <div
                            key={event.relativeTimeInMs}
                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                        >
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {event.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {event.description}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {event.relativeTimeInMs}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <Check /> Mark all as read
                </Button>
            </CardFooter>
        </Card>
    )
}