"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePrint}
    >
      <Printer className="size-4" />

      Export / print
    </Button>
  );
}
