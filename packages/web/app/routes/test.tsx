import type { Route } from "./+types/test";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Form, NavLink, Outlet, redirect } from "react-router";
import { getRunsByTestId, getTestById } from "~/lib/data";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";


export async function action({
  request,
  params,
}: Route.ActionArgs) {
  
  console.log("Starting new run of test!!")

  return redirect(`/tests/${params.testId}/run/3`);
}


export async function loader({ params }: Route.LoaderArgs) {
  const testId = Number(params.testId)
  const selectedTest = await getTestById(testId)
  const runs = await getRunsByTestId(testId)


  return { selectedTest, runs }
}



export default function Component({
  params,
  loaderData
}: Route.ComponentProps) {
  params.testId;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  function getRelativeTime(date: Date) {
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (Math.abs(diffInDays) > 0) return rtf.format(diffInDays, 'day');
    if (Math.abs(diffInHours) > 0) return rtf.format(diffInHours, 'hour');
    if (Math.abs(diffInMins) > 0) return rtf.format(diffInMins, 'minute');
    return rtf.format(diffInSecs, 'second');
  }

  return (


    <div className="flex flex-1 flex-row">
      <div className="flex flex-none flex-col gap-4 p-4 w-[400px]">
        <div className=" gap-4 p-4">
          <span className="font-medium line-clamp-2 whitespace-break-spaces">{loaderData.selectedTest?.description}</span>
          <span className="line-clamp-3 whitespace-break-spaces text-xs">
            {loaderData.selectedTest?.instruction}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">


        <Form method="post">
          <Button type="submit" variant={"secondary"}>
            <Play /> Start Test
          </Button>
          </Form>

          <h1 className="text-lg font-medium">Runs</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {loaderData.runs.map((run) => (

                <TableRow key={run.id}>
                  <TableCell className="font-medium"><NavLink to={`/tests/${run.testId}/run/${run.id}`} end>{getRelativeTime(run.date)}</NavLink></TableCell>
                  <TableCell>{run.status}</TableCell>
                  <TableCell>{run.durationInSeconds}</TableCell>
                </TableRow>
              ))}


            </TableBody>
          </Table>

        </div>
      </div>
      <div className="flex flex-1 grow flex-col gap-4 p-4">
        <Outlet></Outlet>
      </div>
    </div>

  )
}
