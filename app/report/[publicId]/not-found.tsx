import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ReportNotFound() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-normal">Report not found</h1>
        <p className="mt-3 text-muted-foreground">
          This audit may have been removed or the URL may be incomplete.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Run a new audit</Link>
        </Button>
      </div>
    </main>
  );
}
