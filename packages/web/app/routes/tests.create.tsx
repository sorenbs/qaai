import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createTest } from "~/lib/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  await createTest(
    formData.get("description") as string,
    formData.get("instruction") as string
  );

  return redirect("/tests");
};
