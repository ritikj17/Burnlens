"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Loader2, Mail } from "lucide-react";

import type { PublicAuditReport } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadCaptureForm({
  report
}: {
  report: PublicAuditReport;
}) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const lowSavings =
    report.result.totalMonthlySavings < 100;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsPending(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const companyName = formData.get(
      "companyName"
    ) as string;

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_name: companyName || "there",
          monthly_savings: `$${report.result.totalMonthlySavings}/mo`,
          report_url: `${window.location.origin}/report/${report.publicId}`,
          to_email: email
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setMessage(
        "Your report details were saved and the email was sent successfully."
      );

      form.reset();
    } catch (error) {
      console.error("EMAILJS ERROR:", error);

      setMessage(
        "Your report details were saved, but the email could not be sent."
      );
    }

    setIsPending(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal">
          {lowSavings
            ? "Monitor future savings"
            : "Save this report"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {lowSavings
            ? "Your stack already looks fairly disciplined. Leave an email to receive future pricing updates."
            : "Save your report and receive a direct copy by email."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="lead-email">
            Email
          </Label>

          <Input
            id="lead-email"
            name="email"
            type="email"
            placeholder="founder@company.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">
            Company
          </Label>

          <Input
            id="company-name"
            name="companyName"
            placeholder="Acme AI"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">
            Role
          </Label>

          <Input
            id="role"
            name="role"
            placeholder="Founder, CTO, Finance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-team-size">
            Team size
          </Label>

          <Input
            id="lead-team-size"
            name="teamSize"
            type="number"
            min={1}
            defaultValue={report.teamSize}
          />
        </div>
      </div>

      {message ? (
        <p className="text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mail className="size-4" />
        )}

        {isPending
          ? "Sending..."
          : "Email me the report"}
      </Button>
    </form>
  );
}