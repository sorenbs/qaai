import { redirect, type ActionFunctionArgs } from "react-router";
import { createTest } from "~/lib/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Create test and get the created record
  const test = await createTest(
    formData.get("description") as string,
    formData.get("instruction") as string
  );

  // Redirect to the new test's detail page
  return redirect(`/tests/${test.id}`);
};
