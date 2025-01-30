import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createTest } from "~/lib/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  const test = await createTest(
    formData.get("description") as string,
    formData.get("instruction") as string
  );

  return redirect(`/tests/${test.id}`); 
};



export default function Component() {

  return (
        <Form method="post" action="/tests/create" className="max-w-xl">
          <h1>Create New Test</h1>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Title</Label>
              <Input
                id="description"
                name="description"
                placeholder="Test title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instruction">Description</Label>
              <Textarea
              className="min-h-60"
                id="instruction"
                name="instruction"
                placeholder="Test description"
                
                required
              />
            </div>
            <Button type="submit">
              Create Test
            </Button>
          </div>
        </Form>
  );
}
