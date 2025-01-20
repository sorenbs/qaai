import type { Route } from "./+types/tests";
import { AppSidebar } from "~/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { Outlet } from "react-router";
import { getAllTests } from "~/lib/data";

export type Test = { id: number; desciption: string; date: string; instruction: string; }

export async function loader({ params }: Route.LoaderArgs): Promise<{ tests: Test[]; selectedTest: Test | undefined }> {
  const tests = getAllTests()

  const selectedTest = tests.find((test) => test.id === Number(params.testId))
  return { tests, selectedTest }
}



export default function Component({
  params,
  loaderData
}: Route.ComponentProps) {
  params.testId;

  return (

    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar tests={loaderData.tests} />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/tests">Tests</BreadcrumbLink>
              </BreadcrumbItem>
              {loaderData.selectedTest && (<>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{loaderData.selectedTest.desciption}</BreadcrumbPage>
                </BreadcrumbItem>
              </>)}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet></Outlet>
        </div>
      </SidebarInset>
    </SidebarProvider>

  )
}
