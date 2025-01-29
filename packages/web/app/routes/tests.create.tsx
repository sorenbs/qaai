import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createTest } from "~/lib/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  const test = await createTest(
    formData.get("description") as string,
    formData.get("instruction") as string
  );

  // Server-side redirect to the new test's URL
  return redirect(`/tests/${test.id}`); 
};
