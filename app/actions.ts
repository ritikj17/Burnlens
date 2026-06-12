"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auditStartupSpend } from "@/lib/audit/audit-engine";
import { generatePersonalizedSummary } from "@/lib/ai-summary";
import { getSiteUrl } from "@/lib/env";
import { hashIdentifier, isRateLimited } from "@/lib/rate-limit";
import { buildPublicAuditReport } from "@/lib/public-report";
import { fetchPublicAudit, insertAudit, insertLead } from "@/lib/supabase/server";
import type { AuditInput, AuditResult, PrimaryUseCase, ToolId } from "@/types/audit";
import { toolIds } from "@/types/audit";

const toolSchema = z.object({
  toolId: z.enum(toolIds),
  planId: z.string().min(1),
  monthlySpend: z.number().min(0).max(1_000_000),
  seats: z.number().int().min(1).max(100_000),
  enabled: z.boolean()
});

const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(100_000),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(toolSchema).min(1)
});

// Short public IDs are easier to share than full UUIDs.
function createPublicId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 14);
}

export async function createAuditAction(input: AuditInput) {
  const parsed = auditInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Some audit inputs look invalid. Please review the form and try again."
    };
  }

  const serverResult = auditStartupSpend(parsed.data);

  const aiSummary = await generatePersonalizedSummary(
    parsed.data,
    serverResult
  );

  const publicId = createPublicId();

  // Reports still work locally even if persistence is unavailable.
  const insertResult = await insertAudit({
    publicId,
    result: serverResult,
    aiSummary
  });

  if (!insertResult.ok) {
    return {
      ok: false as const,
      error: insertResult.error,
      fallbackReport: buildPublicAuditReport({
        publicId: "local-preview",
        createdAt: new Date().toISOString(),
        result: serverResult,
        aiSummary
      })
    };
  }

  return {
    ok: true as const,
    publicId,
    reportUrl: `${getSiteUrl()}/report/${publicId}`
  };
}

const leadSchema = z.object({
  publicId: z.string().min(3),
  email: z.string().email(),
  companyName: z.string().max(120).optional(),
  role: z.string().max(120).optional(),
  teamSize: z.coerce.number().int().min(1).max(100_000).optional(),
  website: z.string().max(0).optional()
});

export async function captureLeadAction(
  previousState: { ok?: boolean; message?: string },
  formData: FormData
) {
  const parsed = leadSchema.safeParse({
    publicId: formData.get("publicId"),
    email: formData.get("email"),
    companyName: formData.get("companyName") || undefined,
    role: formData.get("role") || undefined,
    teamSize: formData.get("teamSize") || undefined,
    website: formData.get("website") || undefined
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email before requesting the report."
    };
  }

  const headerStore = await headers();

  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";

  const ipHash = hashIdentifier(ip);

  // Lightweight abuse protection for repeated lead submissions.
  if (isRateLimited(`lead:${ipHash}`, 8, 60 * 60 * 1000)) {
    return {
      ok: false,
      message:
        "Too many requests were submitted recently from this network. Please try again later."
    };
  }

  const report = await fetchPublicAudit(parsed.data.publicId);

  if (!report) {
    return {
      ok: false,
      message:
        "This report could not be located. Please refresh the page and try again."
    };
  }

  const leadResult = await insertLead({
    report,
    email: parsed.data.email,
    companyName: parsed.data.companyName,
    role: parsed.data.role,
    teamSize: parsed.data.teamSize,
    ipHash,
    userAgent: headerStore.get("user-agent") || undefined
  });

  if (!leadResult.ok) {
    return {
      ok: false,
      message: leadResult.error
    };
  }

  return {
    ok: true,
    message: "Lead captured successfully."
  };
}

export type CreateAuditActionInput = {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: Array<{
    toolId: ToolId;
    planId: string;
    monthlySpend: number;
    seats: number;
    enabled: boolean;
  }>;
};

export type CreateAuditActionResult =
  | {
      ok: true;
      publicId: string;
      reportUrl: string;
    }
  | {
      ok: false;
      error: string;
      fallbackReport?: {
        result: AuditResult;
        aiSummary: string;
      };
    };
