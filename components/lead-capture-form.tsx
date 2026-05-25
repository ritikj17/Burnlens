"use client";

import { useActionState } from "react";
import { Loader2, Mail } from "lucide-react";

import { captureLeadAction } from "@/app/actions";
import type { PublicAuditReport } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  ok: false,
  message: ""
};

export function LeadCaptureForm({ report }: { report: PublicAuditReport }) {
  const [state, formAction, isPending] = useActionState(
    captureLeadAction,
    initialState
  );

  const lowSavings = report.result.totalMonthlySavings < 100;

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
      <input type="hidden" name="publicId" value={report.publicId} />

      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        name="website"
        aria-hidden="true"
      />

      <div>
        <h2 className="text-lg font-semibold tracking-normal">
          {lowSavings ? "Stay updated on pricing changes" : "Email this report"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {lowSavings
            ? "Your current setup already looks fairly reasonable. If pricing changes or better plan options become available later, BurnLens can send occasional updates."
            : "Receive a copy of the report by email and optionally provide more context for follow-up recommendations or pricing support."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="lead-email">Email</Label>

          <Input
            id="lead-email"
            name="email"
            type="email"
            placeholder="founder@company.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">Company</Label>

          <Input
            id="company-name"
            name="companyName"
            placeholder="Company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>

          <Input
            id="role"
            name="role"
            placeholder="Founder, CTO, Engineering, Operations..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-team-size">Team size</Label>

          <Input
            id="lead-team-size"
            name="teamSize"
            type="number"
            min={1}
            defaultValue={report.teamSize}
          />
        </div>
      </div>

      {state.message ? (
        <p
          className={`text-sm ${
            state.ok ? "text-emerald-700" : "text-destructive"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mail className="size-4" />
        )}

        {isPending ? "Sending..." : "Send report by email"}
      </Button>
    </form>
  );
}
