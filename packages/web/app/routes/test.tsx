import type { Route } from "./+types/test";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { NavLink, Outlet } from "react-router";
import { getRunsByTestId, getTestById } from "~/lib/data";


export async function loader({ params }: Route.LoaderArgs) {
  const testId = Number(params.testId)
  const selectedTest = getTestById(testId)
  const runs = getRunsByTestId(testId)
  

  return { selectedTest, runs }
}



export default function Component({
  params,
  loaderData
}: Route.ComponentProps) {
  params.testId;

  return (


    <div className="flex flex-1 flex-row">
      <div className="flex flex-none flex-col gap-4 p-4 w-[400px]">
        <div className=" gap-4 p-4">
          <span className="font-medium line-clamp-2 whitespace-break-spaces">{loaderData.selectedTest?.desciption}</span>
          <span className="line-clamp-3 whitespace-break-spaces text-xs">
            {loaderData.selectedTest?.instruction}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          Runs

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
                  <TableCell className="font-medium"><NavLink to={`/tests/${run.testId}/run/${run.id}`} end>Today</NavLink></TableCell>
                  <TableCell>✅ Success</TableCell>
                  <TableCell>1:22</TableCell>
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
