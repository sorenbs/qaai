import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useFetcher } from "react-router";

export function AddTestDialog() {
  const fetcher = useFetcher();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="text-lg">+</span>
          <span className="sr-only">Add Test</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" action="/tests/create">
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
              <Input
                id="instruction"
                name="instruction"
                placeholder="Test description"
                required
              />
            </div>
            <Button type="submit">
              {fetcher.state === "submitting" ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
